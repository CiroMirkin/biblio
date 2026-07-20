import type { HistorialEntry } from '@shared/models'
import { getHistorialWorksheet } from '../../constants'
import { rowToHistorialEntry } from '../../models/historial'

export async function getHistorialSocio(nroSocio: number): Promise<HistorialEntry[]> {
  const { worksheet } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const results: HistorialEntry[] = []
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (Number(row.getCell(4).value) === nroSocio) {
      const entry = rowToHistorialEntry(row)
      if (entry) results.push(entry)
    }
  }
  return results
}
