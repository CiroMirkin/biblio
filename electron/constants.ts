import ExcelJS from 'exceljs'
import path from 'node:path'
import { app } from 'electron'
import { existsSync } from 'node:fs'

type HojaExcel = {
  workbook: ExcelJS.Workbook,
  worksheet: ExcelJS.Worksheet | undefined,
  writeWorkbook: () => Promise<void>,
}

async function abrirHoja(xlsxPath: string, hoja: string): Promise<HojaExcel> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(xlsxPath)
  const worksheet = workbook.getWorksheet(hoja)
  const writeWorkbook = async () => await workbook.xlsx.writeFile(xlsxPath)
  return { workbook, worksheet, writeWorkbook }
}

export const MESES = Object.freeze(
  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
)

export const IS_DEV = Boolean(process.env.VITE_DEV_SERVER_URL)
export const IS_TEST = Boolean(process.env.IS_TEST)

const FIXTURES_PATH = path.join(process.cwd(), 'tests', 'fixtures')

const RESOURCES_PATH = IS_DEV
  ? path.join(process.cwd(), 'templates-dev')
  : path.join(process.resourcesPath, 'templates')

const SOCIOS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'socios.xlsx')
  : path.join(app.getPath('userData'), 'socios.xlsx')

export const SOCIOS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'socios-test.xlsx')
  : SOCIOS_XLSX_DEFAULT

export const getSociosWorksheet = () => abrirHoja(SOCIOS_XLSX_PATH, 'Hoja1')

const CUOTAS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'cuotas.xlsx')
  : path.join(app.getPath('userData'), 'cuotas.xlsx')

export const CUOTAS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'cuotas-test.xlsx')
  : CUOTAS_XLSX_DEFAULT

export const getCuotasWorksheet = () => abrirHoja(CUOTAS_XLSX_PATH, 'original')

const LIBROS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'libros.xlsx')
  : path.join(app.getPath('userData'), 'libros.xlsx')

export const LIBROS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'libros-test.xlsx')
  : LIBROS_XLSX_DEFAULT

export const getLibrosWorksheet = () => abrirHoja(LIBROS_XLSX_PATH, 'Hoja1')

const PRESTAMOS_HISTORIAL_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'prestamos_historial.xlsx')
  : path.join(app.getPath('userData'), 'prestamos_historial.xlsx')

export const PRESTAMOS_HISTORIAL_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'prestamos-historial-test.xlsx')
  : PRESTAMOS_HISTORIAL_XLSX_DEFAULT

export async function getHistorialWorksheet(): Promise<HojaExcel> {
  if (!existsSync(PRESTAMOS_HISTORIAL_XLSX_PATH)) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('prestamos')
    worksheet.columns = [
      { header: 'idPrestamo', key: 'idPrestamo' },
      { header: 'fechaPrestamo', key: 'fechaPrestamo' },
      { header: 'fechaDevolucion', key: 'fechaDevolucion' },
      { header: 'nroSocio', key: 'nroSocio' },
      { header: 'nroLibro', key: 'nroLibro' },
    ]
    await workbook.xlsx.writeFile(PRESTAMOS_HISTORIAL_XLSX_PATH)
  }

  return abrirHoja(PRESTAMOS_HISTORIAL_XLSX_PATH, 'prestamos')
}

const SCRIPTS_PATH = IS_DEV
  ? path.join(process.cwd(), 'scripts')
  : path.join(process.resourcesPath, 'scripts')

export const SCRIPT_SINCRONIZAR_SHEETS_PATH = path.join(SCRIPTS_PATH, 'ActualizarExcelDesdeSheets.ps1')

const SINCRONIZACION_DIR = path.dirname(LIBROS_XLSX_PATH)
export const SHEET_URL_TXT_PATH = path.join(SINCRONIZACION_DIR, 'sheet-url.txt')
export const SINCRONIZACION_LOG_PATH = path.join(SINCRONIZACION_DIR, 'log.txt')

export const TEMPLATES_PATH = RESOURCES_PATH