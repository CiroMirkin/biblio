import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PRESTAMOS_HISTORIAL_XLSX_PATH } from '../electron/constants'
import { eliminarHistorialAnio, insertarHistorial } from '../electron/handlers/historial'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = path.join(__dirname, 'fixtures', 'prestamos-historial-template.xlsx')

describe('eliminarHistorialAnio (integration)', () => {
  beforeEach(() => {
    fs.copyFileSync(TEMPLATE_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH)
  })

  afterEach(() => {
    if (fs.existsSync(PRESTAMOS_HISTORIAL_XLSX_PATH)) {
      fs.rmSync(PRESTAMOS_HISTORIAL_XLSX_PATH, { force: true })
    }
  })

  it('Elimina solo las filas del año indicado', async () => {
    const fecha2023 = new Date('2023-05-10')
    const fecha2024 = new Date('2024-03-15')
    const fecha2025 = new Date('2025-07-20')

    await insertarHistorial(fecha2023, 1, 'LIB-001')
    await insertarHistorial(fecha2024, 2, 'LIB-002')
    await insertarHistorial(fecha2025, 3, 'LIB-003')
    await insertarHistorial(fecha2024, 4, 'LIB-004')
    await insertarHistorial(fecha2023, 5, 'LIB-005')

    const eliminados = await eliminarHistorialAnio(2024)

    expect(eliminados).toBe(2)
  }, 30000)
})
