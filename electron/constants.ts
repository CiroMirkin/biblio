import path from 'node:path'
import { app } from 'electron'

export const MESES = Object.freeze(
  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
)

export const IS_DEV = Boolean(process.env.VITE_DEV_SERVER_URL)

export const SOCIOS_XLSX_PATH = IS_DEV
  ? path.join(process.cwd(), 'templates', 'socios.xlsx')
  : path.join(app.getPath('userData'), 'socios.xlsx')

export const CUOTAS_XLSX_PATH = IS_DEV
  ? path.join(process.cwd(), 'templates', 'cuotas.xlsx')
  : path.join(app.getPath('userData'), 'cuotas.xlsx')

export const LIBROS_XLSX_PATH = IS_DEV
  ? path.join(process.cwd(), 'templates', 'libros.xlsx')
  : path.join(app.getPath('userData'), 'libros.xlsx')
