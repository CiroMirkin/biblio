import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { changeObservaciones } from '../electron/handlers/changeObservaciones'
import { SOCIOS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'socios-template.xlsx')

describe('changeObservaciones (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, SOCIOS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(SOCIOS_XLSX_PATH)) {
            fs.rmSync(SOCIOS_XLSX_PATH, { force: true })
        }
    })

    it('Modifica las observaciones de un socio existente en disco', async () => {
        const nroSocio = 8
        const nuevasObs = 'Observacion de prueba'

        const result = await changeObservaciones(nuevasObs, nroSocio)

        expect(result).toBe(true)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        let obsEncontrada: string | undefined
        ws!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === nroSocio) {
                obsEncontrada = row.getCell(10).value as string
            }
        })

        expect(obsEncontrada).toBe(nuevasObs)
    }, 30000)

    it('Retorna false y no modifica el archivo si el socio no existe', async () => {
        const statBefore = fs.statSync(SOCIOS_XLSX_PATH).mtimeMs

        const result = await changeObservaciones('obs nueva', 999000001)

        expect(result).toBe(false)

        const statAfter = fs.statSync(SOCIOS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)
})