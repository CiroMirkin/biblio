import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH } from '../constants'
import { rowToSocio } from '../utils/excelhelpers'

export const getSocios = async () => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return []

  const socios: unknown[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    socios.push(rowToSocio(row))
  })

  return socios
}
