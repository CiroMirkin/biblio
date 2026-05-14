import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () => ipcRenderer.invoke('getSocios'),
  getLibro: () => ipcRenderer.invoke('getLibros'),
  getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => ipcRenderer.invoke('getLibrosPrestadosSocio', nombreSocio, nroSocio),
  getCuotasSocio: (nroSocio: number, anio: number) => ipcRenderer.invoke('getCuotasSocio', nroSocio, anio),
  toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => ipcRenderer.invoke('toggleCuota', nroSocio, anio, mesIndex),
})
