import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { ingresarLibroMark21 } from '../electron/handlers/libros/ingresarLibroMark21'
import { LIBROS_XLSX_PATH } from '../electron/constants'
import type { Marc21 } from "@shared/models"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

describe('ingresarLibroMark21 (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    it('Ingresa el libro y lo persiste en el archivo si los datos son correctos y el barcode no existe', async () => {
        const ingreso: Marc21 = {
            titulo: 'El Senor de los Anillos',
            itemType: 'BK',
            holding: {
                barcode: '999999',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: {
                    dewey: "823",
                    cutter: "TOL",
                },
            },
        }

        const result = await ingresarLibroMark21(ingreso)

        expect(result).not.toBeNull()
        expect(result).toEqual(ingreso)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        ws!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(18).value) === ingreso.holding.barcode) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(5).value).toBe(ingreso.titulo)
        expect(filaEncontrada!.getCell(7).value).toBe(ingreso.itemType)
    }, 30000)

    it('Retorna null y no modifica el archivo si faltan datos requeridos', async () => {
        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const ingreso: Marc21 = {
            titulo: '   ',
            itemType: 'BK',
            holding: {
                barcode: '888888',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: {
                    dewey: " ",
                    cutter: " ",
                },
            },
        }

        const result = await ingresarLibroMark21(ingreso)

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)

    it('Retorna null y no modifica el archivo si el barcode o N° de inventario ya esta registrado', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const barcodeExistente = String(ws!.getRow(2).getCell(6).value)

        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const ingreso: Marc21 = {
            titulo: 'Titulo Duplicado',
            itemType: 'BK',
            holding: {
                barcode: barcodeExistente,
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: {
                    dewey: "",
                    cutter: "",
                },
            },
        }

        const result = await ingresarLibroMark21(ingreso)

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)
})