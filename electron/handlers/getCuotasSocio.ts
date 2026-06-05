import ExcelJS from 'exceljs'
import { CUOTAS_XLSX_PATH, MESES } from '../constants'
import { construirIndiceMeses, migrarFaltaDeTextoEnCuota } from '../utils/excelhelpers'

export const getCuotasSocio = async (nroSocio: number, anio?: number) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('original')
  if (!worksheet) return []

  const headerRow = worksheet.getRow(1)
  const indiceMeses = construirIndiceMeses(headerRow)

  if (anio) {
    return {
      meses: extraerMesesDeAnio(worksheet, indiceMeses, nroSocio, anio),
      anio,
    }
  }
  
  const anioActual = new Date().getFullYear()
  const LIMITE_BUSQUEDA = 3

  for (let i = 0; i < LIMITE_BUSQUEDA; i++) {
    const anioCandiato = anioActual - i
    const meses = extraerMesesDeAnio(worksheet, indiceMeses, nroSocio, anioCandiato)
    const tienePagos = meses.some(mes => Object.values(mes)[0] === true)

    if (tienePagos) return {
      meses,
      anio: anioCandiato,
    }
  }

  return {
    meses: extraerMesesDeAnio(worksheet, indiceMeses, nroSocio, anioActual),
    anio: anioActual,
  }
}

const extraerMesesDeAnio = (
  worksheet: ExcelJS.Worksheet,
  indiceMeses: Map<number,
  { anio: number, mes: number }>,
  nroSocio: number, anio: number
): Record<string, boolean>[] => {
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
      migrarFaltaDeTextoEnCuota(cell)

      return { [nombre]: cell.value === 'pago' }
    })
  })

  return meses
}
