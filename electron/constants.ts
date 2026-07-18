import ExcelJS from 'exceljs'
import path from 'node:path'
import { app } from 'electron'

type Worksheet = { 
  workbook: ExcelJS.Workbook,
  worksheet: ExcelJS.Worksheet | undefined,
  writeWorkbook: () => Promise<void>,
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

export async function getSociosWorksheet(): Promise<Worksheet> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  const writeWorkbook = async () => await workbook.xlsx.writeFile(SOCIOS_XLSX_PATH)
  return { workbook, worksheet, writeWorkbook }
}

const CUOTAS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'cuotas.xlsx')
  : path.join(app.getPath('userData'), 'cuotas.xlsx')

export const CUOTAS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'cuotas-test.xlsx')
  : CUOTAS_XLSX_DEFAULT

export async function getCuotasWorksheet(): Promise<Worksheet> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('original')
  const writeWorkbook = async () => await workbook.xlsx.writeFile(CUOTAS_XLSX_PATH)
  return { workbook, worksheet, writeWorkbook }
}

const LIBROS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'libros.xlsx')
  : path.join(app.getPath('userData'), 'libros.xlsx')

export const LIBROS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'libros-test.xlsx')
  : LIBROS_XLSX_DEFAULT

export async function getLibrosWorksheet(): Promise<Worksheet> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  const writeWorkbook = async () => await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)
  return { workbook, worksheet, writeWorkbook }
}

const PRESTAMOS_HISTORIAL_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'prestamos_historial.xlsx')
  : path.join(app.getPath('userData'), 'prestamos_historial.xlsx')

export const PRESTAMOS_HISTORIAL_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'prestamos-historial-template.xlsx')
  : PRESTAMOS_HISTORIAL_XLSX_DEFAULT

export async function getHistorialWorksheet(): Promise<Worksheet> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(PRESTAMOS_HISTORIAL_XLSX_PATH)
  const worksheet = workbook.getWorksheet('prestamos')
  const writeWorkbook = async () => await workbook.xlsx.writeFile(PRESTAMOS_HISTORIAL_XLSX_PATH)
  return { workbook, worksheet, writeWorkbook }
}

export const TEMPLATES_PATH = RESOURCES_PATH