import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { editarDatosLibro } from '../electron/handlers/libros'
import { LIBROS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

describe('editarDatosLibro (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    it('Edita el titulo y autor de un libro existente', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(2).getCell(6).value as number

        const result = await editarDatosLibro(nroInventario, {
            titulo: 'Titulo Nuevo',
            autor: 'Autor Nuevo',
        })

        expect(result).not.toBeNull()

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(nroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(4).value).toBe('Autor Nuevo')
        expect(filaEncontrada!.getCell(5).value).toBe('Titulo Nuevo')
    }, 30000)

    it('Cambia el numero de inventario si el nuevo valor es unico', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventarioOriginal = ws!.getRow(2).getCell(6).value as number
        const nroInventarioNuevo = 555555

        const result = await editarDatosLibro(nroInventarioOriginal, {
            numeroInventario: nroInventarioNuevo,
        })

        expect(result).not.toBeNull()

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaConNuevoNro: ExcelJS.Row | undefined
        let filaConViejoNro: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(nroInventarioNuevo)) {
                filaConNuevoNro = row
            }
            if (String(row.getCell(6).value) === String(nroInventarioOriginal)) {
                filaConViejoNro = row
            }
        })

        expect(filaConNuevoNro).toBeDefined()
        expect(filaConViejoNro).toBeUndefined()
    }, 30000)

    it('Retorna null y no modifica el archivo si el nuevo numero de inventario ya existe en otra fila', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventarioFila2 = ws!.getRow(2).getCell(6).value as number
        const nroInventarioFila3 = ws!.getRow(3).getCell(6).value as number

        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const result = await editarDatosLibro(nroInventarioFila2, {
            numeroInventario: nroInventarioFila3,
        })

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)

    it('Permite editar otros datos sin modificar el numero de inventario actual', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(2).getCell(6).value as number

        const result = await editarDatosLibro(nroInventario, {
            numeroInventario: nroInventario,
            autor: 'Autor Sin Cambio De Inventario',
        })

        expect(result).not.toBeNull()

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(nroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(4).value).toBe('Autor Sin Cambio De Inventario')
    }, 30000)

    it('Edita los datos del libro sin eliminar la informacion del prestamo', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(3).getCell(6).value as number

        const result = await editarDatosLibro(nroInventario, {
            numeroInventario: nroInventario,
            autor: 'Autor Sin Cambio De Inventario',
        })

        expect(result).not.toBeNull()
        expect(result).not.toBe('Pepe')

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(nroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(1).value).toBe('Prueba,Julia')
        expect(filaEncontrada!.getCell(2).value).toBe(9)
        expect(filaEncontrada!.getCell(3).value).not.toBeNull()
    }, 30000)


    it('Retorna null y no modifica el archivo si se intenta vaciar el titulo de un libro existente', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(2).getCell(6).value as number

        const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const result = await editarDatosLibro(nroInventario, {
            titulo: '',
        })

        expect(result).toBeNull()

        const statAfter = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        expect(statAfter).toBe(statBefore)
    }, 30000)

    it('Asigna un numero de inventario SN- si se vacia el numero de inventario al editar', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(2).getCell(6).value as number

        const result = await editarDatosLibro(nroInventario, {
            numeroInventario: '',
            titulo: 'Ficciones',
        })

        expect(result).not.toBeNull()

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let idSinInventariar = ''
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(result!.numeroInventario)) {
                idSinInventariar = String(row.getCell(6).value)
            }
            
        })

        expect(idSinInventariar.startsWith('SN-')).toBe(true)
    }, 30000)

    it('No modifica el numero de inventario si datos no incluye ese campo', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')

        const nroInventario = ws!.getRow(2).getCell(6).value as number

        const result = await editarDatosLibro(nroInventario, {
            autor: 'Autor Editado Sin Tocar Inventario',
        })

        expect(result).not.toBeNull()

        const workbookActualizado = new ExcelJS.Workbook()
        await workbookActualizado.xlsx.readFile(LIBROS_XLSX_PATH)
        const wsActualizado = workbookActualizado.getWorksheet('Hoja1')

        let filaEncontrada: ExcelJS.Row | undefined
        wsActualizado!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (String(row.getCell(6).value) === String(nroInventario)) {
                filaEncontrada = row
            }
        })

        expect(filaEncontrada).toBeDefined()
        expect(filaEncontrada!.getCell(4).value).toBe('Autor Editado Sin Tocar Inventario')
    }, 30000)

    it('Retorna null si el libro a editar no existe en el inventario', async () => {
        const result = await editarDatosLibro(999999999, {
            autor: 'No Importa',
        })

        expect(result).toBeNull()
    }, 30000)
})