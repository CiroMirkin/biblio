import { contextBridge, ipcRenderer } from 'electron'
import type { Libro } from "@shared/models/libro"
import type { NewSocio, Socio } from '@shared/models/socio'
import type { Marc21 } from "@shared/models/marc21"

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () => ipcRenderer.invoke('getSocios'),
  getLibros: () => ipcRenderer.invoke('getLibros'),
  editarDatosLibro: (nro: number, datos: Partial<Libro>) => ipcRenderer.invoke('editarDatosLibro', nro, datos),
  devolverLibro: (numeroInventario: number | string) => ipcRenderer.invoke('devolverLibro', numeroInventario),
  
  addLibroPrestado: (libro: Libro, fecha?: Date) => ipcRenderer.invoke('addLibroPrestado', libro, fecha),
  ingresarLibro: (ingreso: Libro) => ipcRenderer.invoke('ingresarLibro', ingreso),
  ingresarLibroMark21: (ingreso: Marc21) => ipcRenderer.invoke('ingresarLibroMark21', ingreso),
  
  getLibrosPrestadosSocio: (nroSocio: number) => ipcRenderer.invoke('getLibrosPrestadosSocio', nroSocio),
  
  getSociosConLibros: () => ipcRenderer.invoke('getSociosConLibros'),
  
  cambiarNombreSocio: (nroSocio: number, nombre: string) => ipcRenderer.invoke(
    'cambiarNombreSocio', 
    nroSocio,
    nombre,
  ),
  
  editarDatosSocio: (nroSocio: number, datos: Partial<import('../shared/models').Socio>) => 
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
  createSocio: (socio: NewSocio) => ipcRenderer.invoke('createSocio', socio),
  
  copiarExcel: (key: 'socios' | 'cuotas' | 'libros') => ipcRenderer.invoke('copiarExcel', key),
  obtenerArchivoMrc: (excluirSinIsbn?: boolean) => ipcRenderer.invoke(
    'obtenerArchivoMrc', excluirSinIsbn
  ),
  importarMrc: (filePath: string) => ipcRenderer.invoke('importarMrc', filePath),
  exportarExcelCompleto: () => ipcRenderer.invoke('exportarExcelCompleto'),
  importarExcelCompleto: () => ipcRenderer.invoke('importarExcelCompleto'),
  
  settingsGetAll: () => ipcRenderer.invoke('settings:getAll'),
  settingsGet: (key: string) => ipcRenderer.invoke('settings:get', key),
  settingsSet: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
  
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
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
