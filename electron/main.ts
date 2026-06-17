import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import path from 'node:path'
import type { Libro } from './models/libro'
import { addLibroPrestado, darDeBajaSocio, devolverLibro, getCuotasSocio, getLibros, getLibrosPrestadosSocio, getSocios, reactivarSocio, toggleCuota, createSocio, changeObservaciones, getSociosConLibros, editarDatosSocio, cambiarNombreSocio, vincularSocios, desvincularSocios, } from './handlers'
import { copiarExcel, type ArchivoKey } from './utils/copiarExcel'
import type { NewSocioData, Socio } from './models/socio'
import { initializeDataFiles } from './utils/initializeDataFiles'
import { registerSettingsHandlers } from './utils/registerSettingsHandlers'
import { IS_DEV } from './constants'

const __dirname = path.dirname(__filename)

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) app.quit()

let mainWindow: BrowserWindow | null = null
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

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

ipcMain.handle('editarDatosSocio', (_event, nroSocio: number, datos: Partial<Socio>) => editarDatosSocio(nroSocio, datos))
ipcMain.handle('cambiarNombreSocio', (_event, nroSocio: number, nombre: string) => cambiarNombreSocio(nroSocio, nombre))

ipcMain.handle(
  'vincularSocios',
  (_event, socio1: Socio, socio2: Socio) => vincularSocios(socio1, socio2)
)
ipcMain.handle(
  'desvincularSocios',
  (_event, socio1: Socio, socio2: Socio) => desvincularSocios(socio1, socio2)
)

ipcMain.handle('changeObservaciones', (_event, obs: string, nroSocio: number) => changeObservaciones(obs, nroSocio))

ipcMain.handle('copiarExcel', (_event, key: ArchivoKey) => copiarExcel(key))

function setupUpdater(win: BrowserWindow) {
  autoUpdater.logger = log
  log.transports.file.level = 'debug'
  autoUpdater.autoDownload = false
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'CiroMirkin',
    repo: 'biblio',
    releaseType: 'release',
  })

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-available', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('download-progress', progress.percent)
  })

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (error) => {
    win.webContents.send('update-error', error.message)
  })

  ipcMain.handle('start-download', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: IS_DEV
      ? path.join(process.cwd(), 'public/icon.ico')
      : path.join(process.resourcesPath, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  })

  setupUpdater(mainWindow)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } 
  
  mainWindow.webContents.once('did-finish-load', () => {
    autoUpdater.checkForUpdates()
  })
}
app.whenReady().then(() => {
  registerSettingsHandlers()
  initializeDataFiles()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})