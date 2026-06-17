import ExcelJS from 'exceljs'
import { CUOTAS_XLSX_PATH } from '../../constants'
import { construirIndiceMeses, toggleCeldaPago } from '../../cuotas'

let writeQueue: Promise<unknown> = Promise.resolve()

function enqueueWrite(fn: () => Promise<unknown>): Promise<unknown> {
  writeQueue = writeQueue.then(fn).catch(fn)
  return writeQueue
}

export const toggleCuota = async (nroSocio: number, anio: number, mesIndex: number) => {
  return enqueueWrite(async () => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(CUOTAS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('original')
    if (!worksheet) throw new Error('Hoja de cuotas no encontrada')

    const headerRow = worksheet.getRow(1)
    const indiceMeses = construirIndiceMeses(headerRow)

    const colEntry = [...indiceMeses.entries()].find(
      ([, { anio: a, mes }]) => a === anio && mes === mesIndex
    )

    if (!colEntry) throw new Error(`Mes ${mesIndex + 1}/${anio} no encontrado en el archivo`)

    const colIndex = colEntry[0]
    let found = false
    let newStatus = false

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      if (Number(row.getCell(3).value) !== nroSocio) return

      found = true
      newStatus = toggleCeldaPago(row.getCell(colIndex))
    })

    if (!found) throw new Error(`Socio ${nroSocio} no encontrado`)

    await workbook.xlsx.writeFile(CUOTAS_XLSX_PATH)
    return newStatus
  })
}
