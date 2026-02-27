import { create } from 'zustand';

// Minimal global typing for the exposed API from preload
declare global {
    interface Window {
        api: any;
    }
}

type CashShift = {
    id: string;
    userId: string;
    status: 'OPEN' | 'CLOSED';
    openingBalance: number;
    closingBalance?: number;
    openedAt: string;
    closedAt?: string | null;
};

type CartItem = { productId: string; quantity: number };

type PosState = {
    currentShift: CashShift | null;
    loading: boolean;
    error?: string | null;
    loadOpenShift: (userId: string) => Promise<void>;
    openShift: (userId: string, openingBalance: number) => Promise<void>;
    closeShift: (shiftId: string, actualCashCount: number) => Promise<{ theoreticalTotal: number; discrepancy: number } | null>;
    processSale: (cartItems: CartItem[], userId: string, shiftId: string, paymentMethod: string, total: number) => Promise<any>;
};

export const usePosStore = create<PosState>((set, get) => ({
    currentShift: null,
    loading: false,
    error: null,

    loadOpenShift: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const shift = await window.api.getOpenShift(userId);
            set({ currentShift: shift, loading: false });
        } catch (err: any) {
            set({ error: err?.message ?? String(err), loading: false });
        }
    },

    openShift: async (userId: string, openingBalance: number) => {
        set({ loading: true, error: null });
        try {
            const shift = await window.api.openShift(userId, openingBalance);
            set({ currentShift: shift, loading: false });
        } catch (err: any) {
            set({ error: err?.message ?? String(err), loading: false });
        }
    },

    closeShift: async (shiftId: string, actualCashCount: number) => {
        set({ loading: true, error: null });
        try {
            const result = await window.api.closeShift(shiftId, actualCashCount);
            set({ currentShift: null, loading: false });
            return { theoreticalTotal: result.theoreticalTotal, discrepancy: result.discrepancy };
        } catch (err: any) {
            set({ error: err?.message ?? String(err), loading: false });
            return null;
        }
    },

    processSale: async (cartItems, userId, shiftId, paymentMethod, total) => {
        set({ loading: true, error: null });
        try {
            const payload = { cartItems, userId, shiftId, paymentMethod, total };
            const sale = await window.api.processSale(payload);
            set({ loading: false });
            return sale;
        } catch (err: any) {
            set({ error: err?.message ?? String(err), loading: false });
            throw err;
        }
    },
}));
