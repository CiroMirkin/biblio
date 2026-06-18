import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { devolverLibro } from '../electron/handlers/prestamos/devolverLibro'
import { addLibroPrestado } from '../electron/handlers/prestamos/addLibroPrestado'
import { LIBROS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

describe('devolverLibro (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    it('Elimina la fila del inventario al devolver un libro sin numero de inventario (SN-)', async () => {
        const libro = {
            titulo: 'Aquel dia en el bosque',
            nombreSocio: 'Prueba,Oscar',
            numeroSocio: 14,
        }
        const prestamo = await addLibroPrestado(libro)
        expect(prestamo).not.toBeNull()

        const idSinInventariar = prestamo!.numeroInventario as string
        expect(idSinInventariar.startsWith('SN-')).toBe(true)

        const result = await devolverLibro(idSinInventariar)
        expect(result).toBe(true)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        let filaEncontrada = false
        ws!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(6).value?.toString() === idSinInventariar) {
                filaEncontrada = true
            }
        })

        expect(filaEncontrada).toBe(false)
    }, 30000)

    it('Borra solo los datos del socio al devolver un libro con numero de inventario', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const filaOriginal = ws!.getRow(2)
        const numeroInventario = filaOriginal.getCell(6).value as number
        const tituloOriginal = filaOriginal.getCell(5).value as string
        const autorOriginal = filaOriginal.getCell(4).value as string

        const result = await devolverLibro(numeroInventario)
        expect(result).toBe(true)

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(numeroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(4).value).toBe(autorOriginal)
        expect(filaEncontrada!.getCell(5).value).toBe(tituloOriginal)
        expect(filaEncontrada!.getCell(1).value).toBe('')
        expect(filaEncontrada!.getCell(2).value).toBeNull()
        expect(filaEncontrada!.getCell(3).value).toBeNull()
    }, 30000)

    it('Retorna false y no modifica el archivo si el libro no existe en el inventario', async () => {
        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const result = await devolverLibro(999999999)

        expect(result).toBe(false)

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)
})