import ExcelJS from 'exceljs'
import type { LibroEnPrestamo } from '../libro'
import { LIBROS_XLSX_PATH } from '../constants'
import { rowToLibro } from '../utils/excelhelpers'

export const getLibros = async (): Promise<LibroEnPrestamo[]> => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('Hoja1')
    if (!worksheet) return []

    const libros: LibroEnPrestamo[] = []
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        libros.push(rowToLibro(row))
    })
    return libros
}
