import { getHistorialWorksheet } from '../../constants'

export async function actualizarFechaDevolucion(idPrestamo: string, fechaDevolucion: Date): Promise<boolean> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (String(row.getCell(1).value ?? '') === idPrestamo) {
      row.getCell(3).value = fechaDevolucion
      row.commit()
      await writeWorkbook()
      return true
    }
  }
  return false
}
