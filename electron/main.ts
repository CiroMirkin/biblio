import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Libro } from './libro'
import { addLibroPrestado, darDeBajaSocio, devolverLibro, getCuotasSocio, getLibros, getLibrosPrestadosSocio, getSocios, reactivarSocio, toggleCuota, createSocio, changeObservaciones, getSociosConLibros, } from './handlers'
import { copiarExcel, type ArchivoKey } from './utils/copiarExcel'
import type { NewSocioData } from './socio'
import { initializeDataFiles } from './utils/initializeDataFiles'
import { registerSettingsHandlers } from './utils/registerSettingsHandlers'
import { IS_DEV } from './constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

ipcMain.handle('getLibros', () => getLibros())
ipcMain.handle('addLibroPrestado', (_, libro: Libro, fecha?: Date) => addLibroPrestado(libro, fecha))
ipcMain.handle('devolverLibro', (_, numeroInventario: number | string) => devolverLibro(numeroInventario))

ipcMain.handle(
  'getLibrosPrestadosSocio',
  (_,nroSocio: number) => getLibrosPrestadosSocio(nroSocio)
)

ipcMain.handle('getSociosConLibros', () => getSociosConLibros())

ipcMain.handle('getSocios', () => getSocios())

ipcMain.handle(
  'getCuotasSocio',
  (_event, nroSocio: number, anio?: number) => getCuotasSocio(nroSocio, anio)
)

ipcMain.handle(
  'toggleCuota',
  (_event, nroSocio: number, anio: number, mesIndex: number) => toggleCuota(nroSocio, anio, mesIndex)
)

ipcMain.handle('createSocio', (_event, socioData: NewSocioData) => createSocio(socioData))

ipcMain.handle('darDeBajaSocio', (_event, nroSocio: number) => darDeBajaSocio(nroSocio))
ipcMain.handle('reactivarSocio', (_event, nroSocio: number) => reactivarSocio(nroSocio))

ipcMain.handle('changeObservaciones', (_event, obs: string, nroSocio: number) => changeObservaciones(obs, nroSocio))

ipcMain.handle('copiarExcel', (_event, key: ArchivoKey) => copiarExcel(key))

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: IS_DEV
      ? path.join(process.cwd(), 'public/icon.ico')
      : path.join(process.resourcesPath, 'icon.ico'),
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