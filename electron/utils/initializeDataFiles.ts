import fs from 'node:fs'
import path from 'node:path'
import { CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, SOCIOS_XLSX_PATH, IS_DEV } from '../constants'

export function initializeDataFiles() {
  if (IS_DEV) return

  const plantillas = [
    { origen: 'socios.xlsx', destino: SOCIOS_XLSX_PATH },
    { origen: 'cuotas.xlsx', destino: CUOTAS_XLSX_PATH },
    { origen: 'libros.xlsx', destino: LIBROS_XLSX_PATH },
  ]

  for (const { origen, destino } of plantillas) {
    if (!fs.existsSync(destino)) {
      const rutaPlantilla = path.join(process.resourcesPath, 'templates', origen)
      fs.copyFileSync(rutaPlantilla, destino)
    }
  }
}