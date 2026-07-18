import { getHistorialWorksheet } from '../../constants'

export async function getHistorialSocio(anio: number): Promise<number> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const filasAEliminar: number[] = []
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    const fecha = row.getCell(2).value
    if (fecha instanceof Date && fecha.getFullYear() === anio) {
      filasAEliminar.push(i)
    }
    else if (fecha && !(fecha instanceof Date)) {
      const parsed = new Date(String(fecha))
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() === anio) {
        filasAEliminar.push(i)
      }
    }
  }

  filasAEliminar.sort((a, b) => b - a)
  for (const fila of filasAEliminar) {
    worksheet.getRow(fila).splice(1, worksheet.columnCount)
  }

  await writeWorkbook()
  return filasAEliminar.length
}
