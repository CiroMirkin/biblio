import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../constants'

export async function devolverLibro(numeroInventario: number): Promise<boolean> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return false

  let found = false

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    if (Number(row.getCell(3).value) === numeroInventario) {
      row.getCell(4).value = ''
      row.getCell(5).value = null
      row.commit()
      found = true
    }
  })

  if (!found) return false

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)
  return true
}
