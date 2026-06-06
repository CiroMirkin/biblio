import ExcelJS from 'exceljs'
import type { Libro, LibroEnPrestamo } from '../libro'
import { LIBROS_XLSX_PATH } from '../constants'
import { generarIdSinInventariar } from '../utils/libroSinInventariar'

export async function addLibroPrestado(libro: Libro, fecha?: Date): Promise<LibroEnPrestamo | null> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return null

  if(!libro.titulo) return null

  let targetRow: ExcelJS.Row | null = null
  const date = fecha ? fecha : new Date()
  const numeroInventario = libro.numeroInventario || generarIdSinInventariar()

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    
    if (String(row.getCell(3).value) === String(libro.numeroInventario)) {
      targetRow = row
    }
  })

  if (targetRow) {
    (targetRow as ExcelJS.Row).getCell(4).value = libro.nombreSocio;
    (targetRow as ExcelJS.Row).getCell(5).value = libro.numeroSocio ?? null;
    (targetRow as ExcelJS.Row).getCell(6).value = date;
    (targetRow as ExcelJS.Row).commit()
  }
  else {
    const newRow = worksheet.addRow([
      libro.autor || "",
      libro.titulo,
      numeroInventario,
      libro.nombreSocio,
      libro.numeroSocio ?? null,
      date,
    ])
    newRow.commit()
  }

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)

  return {
    ...libro,
    numeroInventario,
    fechaDePrestamo: date,
  }
}