import ExcelJS from 'exceljs'
import { modificarHoja, leerHoja, type HojaExcel, type HojaLectura } from './hojaExcel'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH } from '../constants'

type Lectura<T> = (h: HojaLectura) => T | Promise<T>
type Edicion<T> = (h: HojaExcel) => T | Promise<T>

export const leerSocios = <T>(fn: Lectura<T>) => leerHoja(SOCIOS_XLSX_PATH, 'Hoja1', fn)
export const modificarSocios = <T>(fn: Edicion<T>) => modificarHoja(SOCIOS_XLSX_PATH, 'Hoja1', fn)

export const leerCuotas = <T>(fn: Lectura<T>) => leerHoja(CUOTAS_XLSX_PATH, 'original', fn)
export const modificarCuotas = <T>(fn: Edicion<T>) => modificarHoja(CUOTAS_XLSX_PATH, 'original', fn)

export const leerLibros = <T>(fn: Lectura<T>) => leerHoja(LIBROS_XLSX_PATH, 'Hoja1', fn)
export const modificarLibros = <T>(fn: Edicion<T>) => modificarHoja(LIBROS_XLSX_PATH, 'Hoja1', fn)

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

export const leerHistorial = <T>(fn: Lectura<T>) =>
  leerHoja(PRESTAMOS_HISTORIAL_XLSX_PATH, 'prestamos', fn, crearHistorial)
export const modificarHistorial = <T>(fn: Edicion<T>) =>
  modificarHoja(PRESTAMOS_HISTORIAL_XLSX_PATH, 'prestamos', fn, crearHistorial)
