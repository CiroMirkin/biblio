import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../../constants'
import { type Libro, rowToLibro } from '../../models/libro'

export const getLibrosPrestadosSocio =  async (nroSocio: number) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return []

  const libros: Libro[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const libro = rowToLibro(row)
    if (Number(libro.numeroSocio) === Number(nroSocio)) {
      libros.push(libro)
    }
  })

  return libros
}
