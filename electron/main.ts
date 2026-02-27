import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import { existsSync } from 'fs';
import { createRequire } from 'node:module';
import type { Prisma } from '@prisma/client';
import { fileURLToPath } from 'url';

const isDev = process.env.NODE_ENV !== 'production';

// Configuration du chemin SQLite
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(app.getPath('userData'), 'pharma.db');
const dbUrl = `file:${isDev ? path.join(__dirname, '../../prisma/dev.db') : dbPath}`;

// On définit la variable d'environnement pour les outils CLI (Migrate, etc.)
process.env.DATABASE_URL = dbUrl;

// Utilisation de require pour les modules natifs et Prisma (Vite/ESM)
const requireNode = createRequire(import.meta.url);
const { PrismaClient } = requireNode('@prisma/client');
const Database = requireNode('better-sqlite3');
const { PrismaBetterSqlite3 } = requireNode('@prisma/adapter-better-sqlite3');

// On détermine le chemin absolu du fichier SQLite
const absoluteDbPath = isDev
    ? path.resolve(__dirname, '../prisma/dev.db')
    : path.resolve(app.getPath('userData'), 'pharma.db');

// On s'assure que le dossier parent existe (point critique pour better-sqlite3)
const dbDir = path.dirname(absoluteDbPath);
if (!existsSync(dbDir)) {
    console.log(`Création du dossier de base de données : ${dbDir}`);
    const { mkdirSync } = requireNode('fs'); // Déjà importé en haut via fs, on utilise existsSync importé
    mkdirSync(dbDir, { recursive: true });
}

// Initialisation de l'adaptateur SQLite pour Prisma 7
const sqlite = new Database(absoluteDbPath);
const adapter = new PrismaBetterSqlite3(sqlite);
const prisma = new PrismaClient({ adapter });

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers...
ipcMain.handle('check-updates', async () => {
    try {
        const result = await autoUpdater.checkForUpdates();
        return result;
    } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour :', error);
        throw error;
    }
});

ipcMain.handle('get-open-shift', async (_evt, userId: string) => {
    try {
        const shift = await prisma.cashShift.findFirst({ where: { userId, status: 'OPEN' } });
        return shift;
    } catch (error) {
        console.error('get-open-shift error', error);
        throw error;
    }
});

ipcMain.handle('open-shift', async (_evt, { userId, openingBalance }: { userId: string; openingBalance: number }) => {
    try {
        const shift = await prisma.cashShift.create({
            data: {
                userId,
                openingBalance,
                status: 'OPEN',
            },
        });
        return shift;
    } catch (error) {
        console.error('open-shift error', error);
        throw error;
    }
});

ipcMain.handle('close-shift', async (_evt, { shiftId, actualCashCount }: { shiftId: string; actualCashCount: number }) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const shift = await tx.cashShift.findUnique({ where: { id: shiftId } });
        if (!shift) throw new Error('Shift not found');
        if (shift.status !== 'OPEN') throw new Error('Shift is not open');

        const cashAgg = await tx.sale.aggregate({
            where: { shiftId, paymentMethod: 'CASH' },
            _sum: { total: true },
        });
        const totalCashSales = cashAgg._sum.total ?? 0;

        const theoreticalTotal = shift.openingBalance + totalCashSales;
        const discrepancy = actualCashCount - theoreticalTotal;

        const closed = await tx.cashShift.update({
            where: { id: shiftId },
            data: {
                closingBalance: actualCashCount,
                closedAt: new Date(),
                status: 'CLOSED',
            },
        });

        return {
            closed,
            theoreticalTotal,
            discrepancy,
        };
    });
});

ipcMain.handle('process-sale', async (_evt, { cartItems, userId, shiftId, paymentMethod, total }: any) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const shift = await tx.cashShift.findUnique({ where: { id: shiftId } });
        if (!shift || shift.status !== 'OPEN') throw new Error('Shift not open');

        for (const item of cartItems) {
            let remaining = item.quantity;
            const batches = await tx.productBatch.findMany({
                where: { productId: item.productId, quantity: { gt: 0 } },
                orderBy: { expiryDate: 'asc' },
            });

            for (const batch of batches) {
                if (remaining <= 0) break;
                const take = Math.min(remaining, batch.quantity);
                await tx.productBatch.update({ where: { id: batch.id }, data: { quantity: batch.quantity - take } });
                remaining -= take;
            }

            if (remaining > 0) {
                throw new Error(`Insufficient stock for product ${item.productId}`);
            }
        }

        const sale = await tx.sale.create({ data: { userId, shiftId, total, paymentMethod } });
        return sale;
    });
});
