import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH } from '../constants'
import { writeSocio } from '../utils/excelhelpers'
import type { NewSocioData, Socio } from '../socio'

export const createSocio = async (socioData: NewSocioData): Promise<Socio> => {
  const sociosWorkbook = new ExcelJS.Workbook()
  await sociosWorkbook.xlsx.readFile(SOCIOS_XLSX_PATH)
  const sociosSheet = sociosWorkbook.getWorksheet('Hoja1')
  if (!sociosSheet) throw new Error('No se encontró la hoja "Hoja1"')

  let lastNroSocio = 0

  sociosSheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    const nro = Number(row.getCell(2).value)
    if (nro > lastNroSocio) lastNroSocio = nro
  })

  const newNroSocio = lastNroSocio + 1
  const newSocio: Socio = { nroSocio: newNroSocio, ...socioData }

  const newRow = sociosSheet.addRow([])
  newRow.getCell(2).value = newNroSocio
  writeSocio(newRow, newSocio)

  await sociosWorkbook.xlsx.writeFile(SOCIOS_XLSX_PATH)

  const cuotasWorkbook = new ExcelJS.Workbook()
  await cuotasWorkbook.xlsx.readFile(CUOTAS_XLSX_PATH)
  const cuotasSheet = cuotasWorkbook.getWorksheet('original')
  if (!cuotasSheet) throw new Error('No se encontró la hoja "original"')

  const newCuotasRow = cuotasSheet.addRow([])
  newCuotasRow.getCell(1).value = new Date()
  newCuotasRow.getCell(2).value = socioData.caracterSocio
  newCuotasRow.getCell(3).value = newNroSocio
  newCuotasRow.getCell(4).value = socioData.nombreYApellido

  await cuotasWorkbook.xlsx.writeFile(CUOTAS_XLSX_PATH)

  return newSocio
}