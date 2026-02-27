import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const existingAdmin = await prisma.user.findUnique({
        where: { username: 'admin' },
    });

    if (!existingAdmin) {
        const adminUser = await prisma.user.create({
            data: {
                username: 'admin',
                passwordHash: 'admin_hash_temporaire', // Dans un vrai contexte, utiliser bcrypt
                role: 'ADMIN',
            },
        });
        console.log('Utilisateur ADMIN créé avec succès :', adminUser);
    } else {
        console.log('Utilisateur ADMIN existe déjà.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
