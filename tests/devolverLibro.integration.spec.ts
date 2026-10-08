import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import { devolverLibro } from '../electron/handlers/prestamos/devolverLibro'
import { addLibroPrestado } from '../electron/handlers/prestamos/addLibroPrestado'
import { getHistorialLibro } from '../electron/handlers/historial'
import { LIBROS_XLSX_PATH, PRESTAMOS_XLSX_PATH } from '../electron/constants'
import { holdingVacio } from '@shared/models'
import { leerPrestamosDeDisco, limpiarLibrosYPrestamos, prepararLibrosYPrestamos } from './helpers/prestamos'

// en la fixture el inventario 2 esta prestado a Julia (9)
describe('devolverLibro (integration)', () => {
    beforeEach(prepararLibrosYPrestamos, 30000)
    afterEach(limpiarLibrosYPrestamos)

    it('Saca de prestamos.xlsx un libro sin inventariar al devolverlo', async () => {
        const prestamo = await addLibroPrestado({ titulo: 'Aquel dia en el bosque', nombreSocio: 'Prueba,Oscar', numeroSocio: 14, holding: holdingVacio() })
        const idSinInventariar = String(prestamo!.numeroInventario)

        expect(await devolverLibro(idSinInventariar)).toBe(true)

        expect((await leerPrestamosDeDisco()).some(p => p.nroLibro === idSinInventariar)).toBe(false)
    }, 30000)

    it('Saca el prestamo sin reescribir libros.xlsx', async () => {
        const statLibros = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

        expect(await devolverLibro(2)).toBe(true)

        expect((await leerPrestamosDeDisco()).some(p => p.nroLibro === '2')).toBe(false)
        expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statLibros)
    }, 30000)

    it('Cierra en el historial el mismo prestamo', async () => {
        await addLibroPrestado({ titulo: 'Bar del Infierno', numeroInventario: 1, nombreSocio: 'Juan', numeroSocio: 42, holding: holdingVacio() })

        await devolverLibro(1)

        const [entrada] = await getHistorialLibro('1')
        expect(entrada.fechaDevolucion).toBeInstanceOf(Date)
    }, 30000)

    it('Retorna false y no modifica el archivo si el libro no esta prestado', async () => {
        const statBefore = fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs

        expect(await devolverLibro(1)).toBe(false)

        expect(fs.statSync(PRESTAMOS_XLSX_PATH).mtimeMs).toBe(statBefore)
    }, 30000)
})
