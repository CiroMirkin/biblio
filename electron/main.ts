import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Libro } from './libro'
import { addLibroPrestado, darDeBajaSocio, devolverLibro, getCuotasSocio, getLibros, getLibrosPrestadosSocio, getSocios, reactivarSocio, toggleCuota, createSocio, changeObservaciones, } from './handlers'
import { copiarExcel, type ArchivoKey } from './utils/copiarExcel'
import type { NewSocioData } from './socio'
import { initializeDataFiles } from './utils/initializeDataFiles'
import { registerSettingsHandlers } from './utils/registerSettingsHandlers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

ipcMain.handle('getLibros', () => getLibros())
ipcMain.handle('addLibroPrestado', (_, libro: Libro, fecha?: Date) => addLibroPrestado(libro, fecha))
ipcMain.handle('devolverLibro', (_, numeroInventario: number) => devolverLibro(numeroInventario))

ipcMain.handle(
  'getLibrosPrestadosSocio',
  (_, nombreSocio: string, nroSocio?: number) => getLibrosPrestadosSocio(nombreSocio, nroSocio)
)

ipcMain.handle('getSocios', () => getSocios())

ipcMain.handle(
  'getCuotasSocio',
  (_event, nroSocio: number, anio: number) => getCuotasSocio(nroSocio, anio)
)

ipcMain.handle(
  'toggleCuota',
  (_event, nroSocio: number, anio: number, mesIndex: number) => toggleCuota(nroSocio, anio, mesIndex)
)

ipcMain.handle('createSocio', (_event, socioData: NewSocioData) => createSocio(socioData))

ipcMain.handle('darDeBajaSocio', (_event, nombreSocio: string) => darDeBajaSocio(nombreSocio))
ipcMain.handle('reactivarSocio', (_event, nombreSocio: string) => reactivarSocio(nombreSocio))
ipcMain.handle('changeObservaciones', (_event, obs: string, nombreSocio: string) => changeObservaciones(obs, nombreSocio))

ipcMain.handle('copiarExcel', (_event, key: ArchivoKey) => copiarExcel(key))

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  registerSettingsHandlers()
  initializeDataFiles()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})