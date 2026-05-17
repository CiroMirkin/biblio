import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../constants'
import type { Libro } from '../libro'
import { rowToLibro } from '../utils/excelhelpers'

export const getLibrosPrestadosSocio =  async (nombreSocio: string, nroSocio?: number) => {
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
}
