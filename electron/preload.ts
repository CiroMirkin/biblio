import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () =>
    ipcRenderer.invoke('getSocios'),
  getCuotasSocio: (nroSocio: number, anio: number) =>
    ipcRenderer.invoke('getCuotasSocio', nroSocio, anio),
  toggleCuota: (nroSocio: number, anio: number, mesIndex: number) =>
    ipcRenderer.invoke('toggleCuota', nroSocio, anio, mesIndex),
})
