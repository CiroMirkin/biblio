import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import ExcelJS from 'exceljs'
import { toggleCeldaPago, construirIndiceMeses, migrarCeldaPintadaAPago, rowToSocio, rowToLibro } from './utils/excelhelpers'
import type { Libro } from './libro'
import { CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, SOCIOS_XLSX_PATH } from './constants'
import { addLibroPrestado, devolverLibro, getLibros } from './handlers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

let writeQueue: Promise<unknown> = Promise.resolve()

function enqueueWrite(fn: () => Promise<unknown>): Promise<unknown> {
  writeQueue = writeQueue.then(fn).catch(fn)
  return writeQueue
}

ipcMain.handle('getLibros', () => getLibros())
ipcMain.handle('addLibroPrestado', (_, libro: Libro) => addLibroPrestado(libro))
ipcMain.handle('devolverLibro', (_, numeroInventario: number) => devolverLibro(numeroInventario))

ipcMain.handle('getLibrosPrestadosSocio', async (_, nombreSocio: string, nroSocio?: number) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return []

  const libros: Libro[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const libro = rowToLibro(row)
    if (libro.numeroSocio === nroSocio || libro.nombreSocio === nombreSocio) {
      libros.push(libro)
    }
  })

  return libros
})

ipcMain.handle('getSocios', async () => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return []

  const socios: unknown[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    socios.push(rowToSocio(row))
  })

  return socios
})

ipcMain.handle('getCuotasSocio', async (_event, nroSocio: number, anio: number) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('original')
  if (!worksheet) return []

  const headerRow = worksheet.getRow(1)
  const indiceMeses = construirIndiceMeses(headerRow)

  const columnasSocio = [...indiceMeses.entries()]
    .filter(([, { anio: a }]) => a === Number(anio))
    .map(([colIndex, { mes }]) => ({ colIndex, mes }))
  
  let meses: Record<string, boolean>[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    if (Number(row.getCell(3).value) !== nroSocio) return

    meses = MESES.map((nombre, mesIndex) => {
      const col = columnasSocio.find(c => c.mes === mesIndex)
      if (!col) return { [nombre]: false }
      const cell = row.getCell(col.colIndex)
      migrarCeldaPintadaAPago(cell)
      return { [nombre]: cell.value === 'pago' }
    })
  })

  return meses
})

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