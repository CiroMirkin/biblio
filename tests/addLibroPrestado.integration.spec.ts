import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import ExcelJS from 'exceljs'
import { addLibroPrestado } from '../electron/handlers/prestamos/addLibroPrestado'
import { getHistorialLibro } from '../electron/handlers/historial'
import { LIBROS_XLSX_PATH, PRESTAMOS_XLSX_PATH } from '../electron/constants'
import { holdingVacio } from '@shared/models'
import { leerPrestamosDeDisco, limpiarLibrosYPrestamos, prepararLibrosYPrestamos } from './helpers/prestamos'

const prestamo = (datos: { titulo: string, autor?: string, numeroInventario?: number | string }) => ({
    nombreSocio: 'Juan Perez',
    numeroSocio: 42,
    holding: holdingVacio(),
    ...datos,
})

// en la fixture el inventario 1 (Bar del Infierno) esta disponible
describe('addLibroPrestado (integration)', () => {
    beforeEach(prepararLibrosYPrestamos, 30000)
    afterEach(limpiarLibrosYPrestamos)

    it('Registra el prestamo con los datos del catalogo sin reescribir libros.xlsx', async () => {
        const statLibros = fs.statSync(LIBROS_XLSX_PATH).mtimeMs
        const fecha = new Date('2024-07-15')

        const result = await addLibroPrestado(prestamo({ titulo: 'Titulo Del Form', numeroInventario: 1 }), fecha)

        expect(result?.fechaDePrestamo).toEqual(fecha)
        expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statLibros)

        const registrado = (await leerPrestamosDeDisco()).find(p => p.nroLibro === '1')
        expect(registrado).toMatchObject({
            nroSocio: 42,
            nombreSocio: 'Juan Perez',
            fechaPrestamo: fecha,
            titulo: 'Bar del Infierno',
            autor: 'Alejandro Dolina',
        })

        const historial = await getHistorialLibro('1')
        expect(historial.map(h => h.idPrestamo)).toEqual([registrado!.idPrestamo])
    }, 30000)

    it('Da de alta en el catalogo un numero de inventario que no existe', async () => {
        const result = await addLibroPrestado(prestamo({ titulo: 'El Senor de los Anillos', autor: 'J.R.R. Tolkien', numeroInventario: 9999 }))

        expect(result).not.toBeNull()
        expect((await leerPrestamosDeDisco()).some(p => p.nroLibro === '9999')).toBe(true)

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
        let fila: ExcelJS.Row | undefined
        workbook.getWorksheet('Hoja1')!.eachRow(row => {
            if (String(row.getCell(6).value) === '9999') fila = row
        })
        expect(fila!.getCell(5).value).toBe('El Senor de los Anillos')
        expect(fila!.getCell(1).value).toBeNull()
    }, 30000)

    it('Los libros sin inventariar solo van a prestamos.xlsx', async () => {
        const statLibros = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        const primero = await addLibroPrestado(prestamo({ titulo: 'Primero Sin Numero', numeroInventario: '' }))
        const segundo = await addLibroPrestado(prestamo({ titulo: 'Segundo Sin Numero' }))

        expect(String(primero?.numeroInventario).startsWith('SN-')).toBe(true)
        expect(String(segundo?.numeroInventario).startsWith('SN-')).toBe(true)
        expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statLibros)

        const titulos = (await leerPrestamosDeDisco()).filter(p => p.nroSocio === 42).map(p => p.titulo)
        expect(titulos).toEqual(['Primero Sin Numero', 'Segundo Sin Numero'])
    }, 30000)

    it('Retorna null y no modifica el archivo si el libro no tiene titulo', async () => {
        const statBefore = fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs

        const result = await addLibroPrestado(prestamo({ titulo: '', numeroInventario: 8888 }))

        expect(result).toBeNull()
        expect(fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs).toBe(statBefore)
    }, 30000)

    it('Retorna null y no modifica el archivo si el libro ya esta en prestamo', async () => {
        await addLibroPrestado(prestamo({ titulo: 'Bar del Infierno', numeroInventario: 1 }), new Date('2024-01-01'))
        const statBefore = fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs

        const result = await addLibroPrestado({ ...prestamo({ titulo: 'Bar del Infierno', numeroInventario: 1 }), numeroSocio: 99 })

        expect(result).toBeNull()
        expect(fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs).toBe(statBefore)
    }, 30000)
})
