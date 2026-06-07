import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH } from '../electron/constants'
import { rowToSocio } from '../electron/utils/excelhelpers'
import { editarDatosSocio } from '../electron/handlers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'socios-template.xlsx')

describe('editarDatosSocio (integration)', () => {
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

        const result = await editarDatosSocio(nroSocio, { observaciones: nuevasObs })
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

        const result = await editarDatosSocio(999000001, { observaciones: 'obs nueva' })
        expect(result).toBe(false)

        const statAfter = fs.statSync(SOCIOS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)

    it('Solo modifica los campos indicados y deja el resto intacto', async () => {
        const nroSocio = 8
        const nuevoTelefono = '3515551234'

        const workbookAntes = new ExcelJS.Workbook()
        await workbookAntes.xlsx.readFile(SOCIOS_XLSX_PATH)
        const wsAntes = workbookAntes.getWorksheet('Hoja1')
        let socioAntes: ReturnType<typeof rowToSocio> | undefined
        wsAntes!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === nroSocio) {
                socioAntes = rowToSocio(row)
            }
        })

        await editarDatosSocio(nroSocio, { telefono: nuevoTelefono })

        const workbookDespues = new ExcelJS.Workbook()
        await workbookDespues.xlsx.readFile(SOCIOS_XLSX_PATH)
        const wsDespues = workbookDespues.getWorksheet('Hoja1')
        let socioDespues: ReturnType<typeof rowToSocio> | undefined
        wsDespues!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === nroSocio) {
                socioDespues = rowToSocio(row)
            }
        })

        expect(socioDespues).toBeDefined()
    expect(socioDespues!.nroSocio).toBe(socioAntes!.nroSocio)
        expect(socioDespues!.telefono).toBe(nuevoTelefono)
        expect(socioDespues!.nombreYApellido).toBe(socioAntes!.nombreYApellido)
        expect(socioDespues!.dni).toBe(socioAntes!.dni)
        expect(socioDespues!.email).toBe(socioAntes!.email)
        expect(socioDespues!.observaciones).toBe(socioAntes!.observaciones)
        expect(socioDespues!.domicilio).toBe(socioAntes!.domicilio)
    }, 30000)
})