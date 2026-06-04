import { contextBridge, ipcRenderer } from 'electron'
import type { Libro } from './libro'
import type { NewSocioData } from './socio'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () => ipcRenderer.invoke('getSocios'),
  getLibros: () => ipcRenderer.invoke('getLibros'),
  devolverLibro: (numeroInventario: number | string) => ipcRenderer.invoke('devolverLibro', numeroInventario),
  
  addLibroPrestado: (libro: Libro, fecha?: Date) => ipcRenderer.invoke('addLibroPrestado', libro, fecha),
  
  getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => ipcRenderer.invoke('getLibrosPrestadosSocio', nombreSocio, nroSocio),
  getSociosConLibros: () => ipcRenderer.invoke('getSociosConLibros'),
  getCuotasSocio: (nroSocio: number, anio: number) => ipcRenderer.invoke('getCuotasSocio', nroSocio, anio),
  toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => ipcRenderer.invoke('toggleCuota', nroSocio, anio, mesIndex),
  darDeBajaSocio: (nombreSocio: string) => ipcRenderer.invoke('darDeBajaSocio', nombreSocio),
  reactivarSocio: (nombreSocio: string) => ipcRenderer.invoke('reactivarSocio', nombreSocio),

  changeObservaciones: (observaciones: string, nroSocio: number) => ipcRenderer.invoke(
    'changeObservaciones', observaciones, nroSocio
  ),
  createSocio: (socio: NewSocioData) => ipcRenderer.invoke('createSocio', socio),
  copiarExcel: (key: 'socios' | 'cuotas' | 'libros') => ipcRenderer.invoke('copiarExcel', key),
  settingsGetAll: () => ipcRenderer.invoke('settings:getAll'),
  settingsGet: (key: string) => ipcRenderer.invoke('settings:get', key),
  settingsSet: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
})
