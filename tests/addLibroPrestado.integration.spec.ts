import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { addLibroPrestado } from '../electron/handlers/prestamos/addLibroPrestado'
import { LIBROS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

describe('addLibroPrestado (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    it('Agrega un libro al inventario si el numero de inventario no existe previamente', async () => {
        const libro = {
            titulo: 'El Senor de los Anillos',
            autor: 'J.R.R. Tolkien',
            numeroInventario: 9999,
            nombreSocio: 'Juan Perez',
            numeroSocio: 42,
        }
        const fecha = new Date('2024-06-01')

        const result = await addLibroPrestado(libro, fecha)

        expect(result).not.toBeNull()
        expect(result?.titulo).toBe(libro.titulo)
        expect(result?.fechaDePrestamo).toEqual(fecha)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        ws!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(libro.numeroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(1).value).toBe(libro.nombreSocio)
        expect(filaEncontrada!.getCell(2).value).toBe(libro.numeroSocio)
        expect(filaEncontrada!.getCell(4).value).toBe(libro.autor)
        expect(filaEncontrada!.getCell(5).value).toBe(libro.titulo)
    }, 30000)

    it('Actualiza solo los datos del socio si el libro ya existe en el inventario', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const inventarioExistente = ws!.getRow(2).getCell(6).value

        const libro = {
            titulo: 'Titulo Modificado',
            autor: 'Autor Modificado',
            numeroInventario: inventarioExistente as number,
            nombreSocio: 'Maria Lopez',
            numeroSocio: 7,
        }
        const fecha = new Date('2024-07-15')

        const tituloOriginal = ws!.getRow(2).getCell(5).value as string
        const autorOriginal = ws!.getRow(2).getCell(4).value as string

        const result = await addLibroPrestado(libro, fecha)

        expect(result).not.toBeNull()
        expect(result?.fechaDePrestamo).toEqual(fecha)

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(inventarioExistente)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(1).value).toBe(libro.nombreSocio)
        expect(filaEncontrada!.getCell(2).value).toBe(libro.numeroSocio)
        expect(filaEncontrada!.getCell(4).value).toBe(autorOriginal)
        expect(filaEncontrada!.getCell(5).value).toBe(tituloOriginal)
    }, 30000)

    it('Retorna null y no modifica el archivo si el libro no tiene titulo', async () => {
        const libro = {
            titulo: '',
            autor: 'Autor Sin Titulo',
            numeroInventario: 8888,
            nombreSocio: 'Carlos Ruiz',
            numeroSocio: 5,
        }

        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const result = await addLibroPrestado(libro)

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)

    it('Retorna null y no modifica el archivo si el libro ya esta en prestamo', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const inventarioExistente = ws!.getRow(2).getCell(6).value as number

        const libro = {
            titulo: 'Cualquier Titulo',
            autor: 'Cualquier Autor',
            numeroInventario: inventarioExistente,
            nombreSocio: 'Socio Nuevo',
            numeroSocio: 99,
        }

        await addLibroPrestado(libro, new Date('2024-01-01'))

        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const result = await addLibroPrestado(libro, new Date('2024-06-01'))

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    })
})