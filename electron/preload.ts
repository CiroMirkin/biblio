import { contextBridge, ipcRenderer } from 'electron'
import type { Libro } from './models/libro'
import type { NewSocioData, Socio } from './models/socio'

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
  
  editarDatosSocio: (nroSocio: number, datos: Partial<import('./models/socio').Socio>) => 
    ipcRenderer.invoke('editarDatosSocio', nroSocio, datos),

  vincularSocios: (socio1: Socio, socio2: Socio) => ipcRenderer.invoke(
    'vincularSocios', socio1, socio2
  ),
  desvincularSocios: (socio1: Socio, socio2: Socio) => ipcRenderer.invoke(
    'desvincularSocios', socio1, socio2
  ),

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
    const handler = (_event: unknown, info: unknown) => callback(info)
    ipcRenderer.on('update-available', handler)
    return () => ipcRenderer.removeListener('update-available', handler)
  },
  onProgress: (callback: (percent: number) => void) => {
    const handler = (_event: unknown, percent: number) => callback(percent)
    ipcRenderer.on('download-progress', handler)
    return () => ipcRenderer.removeListener('download-progress', handler)
  },
  onDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', callback)
    return () => ipcRenderer.removeListener('update-downloaded', callback)
  },
  onError: (callback: (message: string) => void) => {
    const handler = (_event: unknown, message: string) => callback(message)
    ipcRenderer.on('update-error', handler)
    return () => ipcRenderer.removeListener('update-error', handler)
  },
  download: () => ipcRenderer.invoke('start-download'),
  install: () => ipcRenderer.invoke('install-update'),
})
