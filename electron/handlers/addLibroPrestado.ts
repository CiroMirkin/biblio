import ExcelJS from 'exceljs'
import type { Libro } from '../libro'
import { LIBROS_XLSX_PATH } from '../constants'

export async function addLibroPrestado(libro: Libro): Promise<boolean> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return false

  let targetRow: ExcelJS.Row | null = null

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    if (Number(row.getCell(3).value) === libro.numeroInventario) {
      targetRow = row
    }
  })

  if (targetRow) {
    (targetRow as ExcelJS.Row).getCell(1).value = libro.autor;
    (targetRow as ExcelJS.Row).getCell(2).value = libro.titulo;
    (targetRow as ExcelJS.Row).getCell(4).value = libro.nombreSocio;
    (targetRow as ExcelJS.Row).getCell(5).value = libro.numeroSocio ?? null;
    (targetRow as ExcelJS.Row).commit()
  } else {
    const newRow = worksheet.addRow([
      libro.autor,
      libro.titulo,
      libro.numeroInventario,
      libro.nombreSocio,
      libro.numeroSocio ?? null,
    ])
    newRow.commit()
  }

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)
  return true
}