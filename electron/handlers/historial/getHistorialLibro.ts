import type { HistorialEntry } from '@shared/models'
import { leerHistorial } from '../../utils/datosExcel'
import { rowToHistorialEntry } from '../../models/historial'

export async function getHistorialLibro(nroLibro: string): Promise<HistorialEntry[]> {
  return leerHistorial(({ worksheet }) => {
    const results: HistorialEntry[] = []
    for (let i = 1; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i)
      const nro = String(row.getCell(5).value ?? '')
      if (nro === nroLibro) {
        const entry = rowToHistorialEntry(row)
        if (entry) results.push(entry)
      }
    }
    return results
  })
}
