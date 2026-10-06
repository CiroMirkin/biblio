import type { HistorialEntry } from '@shared/models'
import { leerHistorial } from '../../utils/datosExcel'
import { celdaHistorial, rowToHistorialEntry } from '../../models/historial'

export async function getHistorialSocio(nroSocio: number): Promise<HistorialEntry[]> {
  return leerHistorial(({ worksheet }) => {
    const results: HistorialEntry[] = []
    for (let i = 1; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i)
      const nro = Number(celdaHistorial(row, 'nroSocio').value)
      if (nro === nroSocio) {
        const entry = rowToHistorialEntry(row)
        if (entry) results.push(entry)
      }
    }
    return results
  })
}
