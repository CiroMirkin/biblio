import ExcelJS from 'exceljs'
import { CUOTAS_XLSX_PATH, MESES } from '../constants'
import { construirIndiceMeses, migrarCeldaPintadaAPago } from '../utils/excelhelpers'

export const getCuotasSocio = async (nroSocio: number, anio: number) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('original')
  if (!worksheet) return []

  const headerRow = worksheet.getRow(1)
  const indiceMeses = construirIndiceMeses(headerRow)

  const columnasSocio = [...indiceMeses.entries()]
    .filter(([, { anio: a }]) => a === Number(anio))
    .map(([colIndex, { mes }]) => ({ colIndex, mes }))
  
  let meses: Record<string, boolean>[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    if (Number(row.getCell(3).value) !== nroSocio) return

    meses = MESES.map((nombre, mesIndex) => {
      const col = columnasSocio.find(c => c.mes === mesIndex)
      if (!col) return { [nombre]: false }
      const cell = row.getCell(col.colIndex)
      migrarCeldaPintadaAPago(cell)
      return { [nombre]: cell.value === 'pago' }
    })
  })

  return meses
}
