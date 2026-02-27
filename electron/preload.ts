import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    checkUpdates: () => ipcRenderer.invoke('check-updates'),
    getOpenShift: (userId: string) => ipcRenderer.invoke('get-open-shift', userId),
    openShift: (userId: string, openingBalance: number) => ipcRenderer.invoke('open-shift', { userId, openingBalance }),
    closeShift: (shiftId: string, actualCashCount: number) => ipcRenderer.invoke('close-shift', { shiftId, actualCashCount }),
    processSale: (payload: any) => ipcRenderer.invoke('process-sale', payload),
});
