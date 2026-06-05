import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { toggleCuota } from '../electron/handlers/toggleCuota'
import { CUOTAS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'cuotas-template.xlsx')

describe('toggleCuota (integration)', () => {
  beforeEach(() => {
    fs.copyFileSync(FIXTURE_PATH, CUOTAS_XLSX_PATH)
  })

  afterEach(() => {
    if (fs.existsSync(CUOTAS_XLSX_PATH)) {
      fs.rmSync(CUOTAS_XLSX_PATH, { force: true })
    }
  })

  it('Modifica el archivo en disco al togglear una cuota existente (null -> pago)', async () => {
    const colIndex = 31
    const socioRow = 21

    const workbookBefore = new ExcelJS.Workbook()
    await workbookBefore.xlsx.readFile(CUOTAS_XLSX_PATH)
    const wsBefore = workbookBefore.getWorksheet('original')
    const cellBefore = wsBefore!.getRow(socioRow).getCell(colIndex).value

    const result = await toggleCuota(20, 2026, 0)

    expect(result).toBe(true)

    const workbookAfter = new ExcelJS.Workbook()
    await workbookAfter.xlsx.readFile(CUOTAS_XLSX_PATH)
    const wsAfter = workbookAfter.getWorksheet('original')
    const cellAfter = wsAfter!.getRow(socioRow).getCell(colIndex).value

    expect(cellAfter).toBe('pago')
    expect(cellBefore).not.toBe(cellAfter)
  }, 30000)
})
