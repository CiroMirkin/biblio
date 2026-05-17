import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import ExcelJS from 'exceljs'
import { toggleCeldaPago, construirIndiceMeses } from './utils/excelhelpers'
import type { Libro } from './libro'
import { CUOTAS_XLSX_PATH } from './constants'
import { addLibroPrestado, devolverLibro, getCuotasSocio, getLibros, getLibrosPrestadosSocio, getSocios } from './handlers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
let writeQueue: Promise<unknown> = Promise.resolve()

function enqueueWrite(fn: () => Promise<unknown>): Promise<unknown> {
  writeQueue = writeQueue.then(fn).catch(fn)
  return writeQueue
}

ipcMain.handle('getLibros', () => getLibros())
ipcMain.handle('addLibroPrestado', (_, libro: Libro) => addLibroPrestado(libro))
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

ipcMain.handle('toggleCuota', async (_event, nroSocio: number, anio: number, mesIndex: number) => {
  return enqueueWrite(async () => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('original')
    if (!worksheet) throw new Error('Hoja de cuotas no encontrada')

    const headerRow = worksheet.getRow(1)
    const indiceMeses = construirIndiceMeses(headerRow)

    const colEntry = [...indiceMeses.entries()].find(
      ([, { anio: a, mes }]) => a === anio && mes === mesIndex
    )

    if (!colEntry) throw new Error(`Mes ${mesIndex + 1}/${anio} no encontrado en el archivo`)

    const colIndex = colEntry[0]
    let found = false
    let newStatus = false

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      if (Number(row.getCell(3).value) !== nroSocio) return

      found = true
      newStatus = toggleCeldaPago(row.getCell(colIndex))
    })

    if (!found) throw new Error(`Socio ${nroSocio} no encontrado`)

    await workbook.xlsx.writeFile(CUOTAS_XLSX_PATH)
    return newStatus
  })
})

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

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})