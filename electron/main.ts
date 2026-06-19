import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import path from 'node:path'
import { ipcHandlers } from './handlers/ipcHandlers'
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

for (const [channel, handler] of Object.entries(ipcHandlers)) {
  ipcMain.handle(channel, handler)
}

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

  mainWindow.maximize()
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