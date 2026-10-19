import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH, PRESTAMOS_XLSX_PATH } from '../electron/constants'
import { migrarPrestamos } from '../electron/utils/migrarPrestamos'
import { insertarHistorial } from '../electron/handlers/historial'
import { getLibros } from '../electron/handlers/libros'
import { leerPrestamosDeDisco, limpiarLibrosYPrestamos } from './helpers/prestamos'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

async function leerLibrosDeDisco() {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
    return workbook.getWorksheet('Hoja1')!
}

// fixture con el inventario 2 prestado a Julia (9) y dos libros sin inventariar prestados a Oscar (14)
describe('migrarPrestamos (integration)', () => {
    beforeEach(() => {
        limpiarLibrosYPrestamos()
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => limpiarLibrosYPrestamos())

    it('Pasa los prestamos activos a prestamos.xlsx y los saca de libros.xlsx', async () => {
        const filasAntes = (await leerLibrosDeDisco()).rowCount

        await migrarPrestamos()

        const prestamos = await leerPrestamosDeDisco()
        expect(prestamos).toHaveLength(3)
        expect(prestamos[0]).toMatchObject({ nroLibro: '2', nroSocio: 9, nombreSocio: 'Prueba,Julia', titulo: 'Ficciones', autor: 'Jorge Luis Borges' })
        expect(prestamos[0].fechaPrestamo).toBeInstanceOf(Date)
        expect(prestamos.slice(1).map(p => p.titulo)).toEqual(['Hamlet - macbeth', 'Aquel dia en el bosque'])
        expect(prestamos.slice(1).every(p => p.nroLibro.startsWith('SN-') && p.nroSocio === 14)).toBe(true)

        const libros = await leerLibrosDeDisco()
        expect(libros.rowCount).toBe(filasAntes - 2)
        libros.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            expect(String(row.getCell(6).value ?? '').startsWith('SN-')).toBe(false)
            expect(row.getCell(1).value || null).toBeNull()
            expect(row.getCell(2).value).toBeNull()
            expect(row.getCell(3).value).toBeNull()
        })
    }, 30000)

    it('Reusa el idPrestamo del historial abierto', async () => {
        const id = await insertarHistorial(new Date('2026-05-12'), 9, '2')

        await migrarPrestamos()

        const prestamos = await leerPrestamosDeDisco()
        expect(prestamos.find(p => p.nroLibro === '2')?.idPrestamo).toBe(id)
        expect(fs.existsSync(PRESTAMOS_HISTORIAL_XLSX_PATH)).toBe(true)
    }, 30000)

    it('No hace nada si prestamos.xlsx ya existe', async () => {
        await migrarPrestamos()
        const statPrestamos = fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs
        const statLibros = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        await migrarPrestamos()

        expect(fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs).toBe(statPrestamos)
        expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statLibros)
    }, 30000)

    it('getLibros cruza el catalogo con los prestamos y agrega los libros sin inventariar', async () => {
        await migrarPrestamos()

        const libros = await getLibros()

        expect(libros.find(l => String(l.numeroInventario) === '2')).toMatchObject({ nombreSocio: 'Prueba,Julia', numeroSocio: 9 })
        expect(libros.find(l => String(l.numeroInventario) === '1')).toMatchObject({ nombreSocio: '', numeroSocio: null, fechaDePrestamo: null })
        expect(libros.filter(l => String(l.numeroInventario).startsWith('SN-')).map(l => l.titulo))
            .toEqual(['Hamlet - macbeth', 'Aquel dia en el bosque'])
    }, 30000)
})
