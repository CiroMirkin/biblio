import ExcelJS from 'exceljs'
import { rowToLibro } from '../../models/libro'
import { type LibroRegistrado } from "@shared/models/libro"
import { LIBROS_XLSX_PATH } from '../../constants'

export const getLibros = async (): Promise<LibroRegistrado[]> => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('Hoja1')
    if (!worksheet) return []

    const libros: LibroRegistrado[] = []
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        libros.push(rowToLibro(row))
    })
    return libros
}
