import ExcelJS from 'exceljs'
import { modificarHoja, leerHoja, type HojaExcel, type HojaLectura } from './hojaExcel'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH, PRESTAMOS_XLSX_PATH } from '../constants'
import { COLUMNAS_PRESTAMO, writePrestamo, type Prestamo } from '../models/prestamo'

const archivo = (path: string, hoja: string, crearSiFalta?: () => Promise<void>) => ({
  leer: <T>(fn: (h: HojaLectura) => T | Promise<T>) =>
    leerHoja(path, hoja, fn, crearSiFalta),

  modificar: <T>(fn: (h: HojaExcel) => T | Promise<T>) =>
    modificarHoja(path, hoja, fn, crearSiFalta),
})

export const {
  leer: leerSocios,
  modificar: modificarSocios,
} = archivo(SOCIOS_XLSX_PATH, 'Hoja1')

export const {
  leer: leerCuotas,
  modificar: modificarCuotas,
} = archivo(CUOTAS_XLSX_PATH, 'original')

export const ANIOS_DE_CUOTAS_CONSERVADOS = 3

export const {
  leer: leerLibros,
  modificar: modificarLibros,
} = archivo(LIBROS_XLSX_PATH, 'Hoja1')

async function crearHistorial() {
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

export const {
  leer: leerHistorial,
  modificar: modificarHistorial,
} = archivo(
  PRESTAMOS_HISTORIAL_XLSX_PATH,
  'prestamos',
  crearHistorial,
)

export async function crearPrestamos(prestamos: Prestamo[] = []) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('prestamos')
  worksheet.columns = Object.keys(COLUMNAS_PRESTAMO).map(key => ({ header: key, key }))
  for (const prestamo of prestamos) writePrestamo(worksheet.addRow([]), prestamo)
  await workbook.xlsx.writeFile(PRESTAMOS_XLSX_PATH)
}

export const {
  leer: leerPrestamos,
  modificar: modificarPrestamos,
} = archivo(
  PRESTAMOS_XLSX_PATH,
  'prestamos',
  crearPrestamos,
)
