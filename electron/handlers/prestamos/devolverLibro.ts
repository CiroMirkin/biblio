import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../../constants'
import { esSinInventariar } from "../../libro"

export async function devolverLibro(numeroInventario: number | string): Promise<boolean> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return false

  let found = false
  const rowsToDelete: number[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    const cellValue = row.getCell(3).value?.toString() ?? ''

    if(cellValue === numeroInventario.toString()) {
      found = true
      
      if (esSinInventariar(numeroInventario)) {
        rowsToDelete.push(rowIndex)
      }
      else {
        row.getCell(4).value = ''
        row.getCell(5).value = null
        row.getCell(6).value = null
        row.commit()
      }
    }
  })

  if (!found) return false

  for (const rowIndex of rowsToDelete.reverse()) {
    worksheet.spliceRows(rowIndex, 1)
  }

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)
  return true
}
