import { contextBridge, ipcRenderer } from 'electron'
import type { Libro } from './libro'
import type { NewSocioData } from './socio'

contextBridge.exposeInMainWorld('electronAPI', {
  getSocios: () => ipcRenderer.invoke('getSocios'),
  getLibros: () => ipcRenderer.invoke('getLibros'),
  devolverLibro: (numeroInventario: number) => ipcRenderer.invoke('devolverLibro', numeroInventario),
  addLibroPrestado: (libro: Libro) => ipcRenderer.invoke('addLibroPrestado', libro),
  getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => ipcRenderer.invoke('getLibrosPrestadosSocio', nombreSocio, nroSocio),
  getCuotasSocio: (nroSocio: number, anio: number) => ipcRenderer.invoke('getCuotasSocio', nroSocio, anio),
  toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => ipcRenderer.invoke('toggleCuota', nroSocio, anio, mesIndex),
  darDeBajaSocio: (nombreSocio: string) => ipcRenderer.invoke('darDeBajaSocio', nombreSocio),
  reactivarSocio: (nombreSocio: string) => ipcRenderer.invoke('reactivarSocio', nombreSocio),
  createSocio: (socio: NewSocioData) => ipcRenderer.invoke('createSocio', socio),
  copiarExcel: (key: 'socios' | 'cuotas' | 'libros') => ipcRenderer.invoke('copiarExcel', key),
})
