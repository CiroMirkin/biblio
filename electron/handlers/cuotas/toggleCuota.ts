import { modificarCuotas } from '../../utils/datosExcel'
import { asegurarAnio, celdaCuotas, construirIndiceMeses, toggleCeldaPago } from '../../models/cuotas'

export const toggleCuota = async (nroSocio: number, anio: number, mesIndex: number) => {
  return modificarCuotas(async ({ worksheet, writeWorkbook }) => {
    asegurarAnio(worksheet, anio)

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
      if (Number(celdaCuotas(row, 'nroSocio').value) !== nroSocio) return

      found = true
      newStatus = toggleCeldaPago(row.getCell(colIndex))
    })

    if (!found) throw new Error(`Socio ${nroSocio} no encontrado`)

    await writeWorkbook()
    return newStatus
  })
}
