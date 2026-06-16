import path from 'node:path'
import { app } from 'electron'

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

const CUOTAS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'cuotas.xlsx')
  : path.join(app.getPath('userData'), 'cuotas.xlsx')

export const CUOTAS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'cuotas-test.xlsx')
  : CUOTAS_XLSX_DEFAULT

const LIBROS_XLSX_DEFAULT = IS_DEV
  ? path.join(RESOURCES_PATH, 'libros.xlsx')
  : path.join(app.getPath('userData'), 'libros.xlsx')

export const LIBROS_XLSX_PATH = IS_TEST
  ? path.join(FIXTURES_PATH, 'libros-test.xlsx')
  : LIBROS_XLSX_DEFAULT

export const TEMPLATES_PATH = RESOURCES_PATH