import { contextBridge, ipcRenderer } from 'electron'
import type { Libro } from './libro'
import type { NewSocioData } from './socio'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () => ipcRenderer.invoke('getSocios'),
  getLibros: () => ipcRenderer.invoke('getLibros'),
  devolverLibro: (numeroInventario: number | string) => ipcRenderer.invoke('devolverLibro', numeroInventario),
  
  addLibroPrestado: (libro: Libro, fecha?: Date) => ipcRenderer.invoke('addLibroPrestado', libro, fecha),
  
  getLibrosPrestadosSocio: (nroSocio: number) => ipcRenderer.invoke('getLibrosPrestadosSocio', nroSocio),
  
  getSociosConLibros: () => ipcRenderer.invoke('getSociosConLibros'),
  
  cambiarNombreSocio: (nroSocio: number, nombre: string) => ipcRenderer.invoke(
    'cambiarNombreSocio', 
    nroSocio,
    nombre,
  ),
  
  editarDatosSocio: (nroSocio: number, datos: Partial<import('./socio').Socio>) => 
    ipcRenderer.invoke('editarDatosSocio', nroSocio, datos),

  getCuotasSocio: (nroSocio: number, anio?: number) => 
    anio !== undefined
      ? ipcRenderer.invoke('getCuotasSocio', nroSocio, anio)
      : ipcRenderer.invoke('getCuotasSocio', nroSocio),

  toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => ipcRenderer.invoke('toggleCuota', nroSocio, anio, mesIndex),

  darDeBajaSocio: (nroSocio: number) => ipcRenderer.invoke('darDeBajaSocio', nroSocio),
  reactivarSocio: (nroSocio: number) => ipcRenderer.invoke('reactivarSocio', nroSocio),

  changeObservaciones: (observaciones: string, nroSocio: number) => ipcRenderer.invoke(
    'changeObservaciones', observaciones, nroSocio
  ),
  createSocio: (socio: NewSocioData) => ipcRenderer.invoke('createSocio', socio),
  copiarExcel: (key: 'socios' | 'cuotas' | 'libros') => ipcRenderer.invoke('copiarExcel', key),
  settingsGetAll: () => ipcRenderer.invoke('settings:getAll'),
  settingsGet: (key: string) => ipcRenderer.invoke('settings:get', key),
  settingsSet: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
})

contextBridge.exposeInMainWorld('updater', {
  onAvailable: (callback: (info: unknown) => void) => {
    ipcRenderer.on('update-available', (_event, info) => callback(info))
  },
  onProgress: (callback: (percent: number) => void) => {
    ipcRenderer.on('download-progress', (_event, percent) => callback(percent))
  },
  onDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', () => callback())
  },
  download: () => ipcRenderer.invoke('start-download'),
  install: () => ipcRenderer.invoke('install-update'),
})
