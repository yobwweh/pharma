import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("api", {
  checkUpdates: () => ipcRenderer.invoke("check-updates"),
  getOpenShift: (userId) => ipcRenderer.invoke("get-open-shift", userId),
  openShift: (userId, openingBalance) => ipcRenderer.invoke("open-shift", { userId, openingBalance }),
  closeShift: (shiftId, actualCashCount) => ipcRenderer.invoke("close-shift", { shiftId, actualCashCount }),
  processSale: (payload) => ipcRenderer.invoke("process-sale", payload)
});
