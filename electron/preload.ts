import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () =>
    ipcRenderer.invoke('getSocios'),
  getCuotasSocio: (nroSocio: number) =>
    ipcRenderer.invoke('getCuotasSocio', nroSocio),
  toggleCuota: (nroSocio: number, mesIndex: number) =>
    ipcRenderer.invoke('toggleCuota', nroSocio, mesIndex),
})
