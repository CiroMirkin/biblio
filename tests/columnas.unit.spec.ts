import { describe, it, expect } from 'vitest'
import { COLUMNAS_HISTORIAL } from '../electron/models/historial'
import { COLUMNAS_CUOTAS } from '../electron/models/cuotas'
import { COLUMNAS_SOCIO } from '../electron/models/socio'
import { COLUMNAS_LIBRO } from '../electron/models/libro'
import { COLUMNAS_PRESTAMO } from '../electron/models/prestamo'

// Los números reflejan el layout de los Excel reales. Si este test falla, el cambio en el model rompe la lectura de archivos existentes.
describe('columnas de los Excel', () => {
    it('historial', () => {
        expect(COLUMNAS_HISTORIAL).toEqual({
            idPrestamo: 1,
            fechaPrestamo: 2,
            fechaDevolucion: 3,
            nroSocio: 4,
            nroLibro: 5,
        })
    })

    it('prestamos', () => {
        expect(COLUMNAS_PRESTAMO).toEqual({
            idPrestamo: 1,
            nroLibro: 2,
            nroSocio: 3,
            nombreSocio: 4,
            fechaPrestamo: 5,
            titulo: 6,
            autor: 7,
        })
    })

    it('cuotas', () => {
        expect(COLUMNAS_CUOTAS).toEqual({
            nroSocio: 3,
            nombre: 4,
        })
    })

    it('socios', () => {
        expect(COLUMNAS_SOCIO).toEqual({
            nroSocio: 1,
            nombreYApellido: 2,
            domicilio: 3,
            dni: 4,
            fechaNacimiento: 5,
            telefono: 6,
            caracterSocio: 7,
            fechaIngreso: 8,
            fechaEgreso: 9,
            observaciones: 10,
            email: 11,
            sociosVinculados: 12,
        })
    })

    it('libros', () => {
        expect(COLUMNAS_LIBRO).toEqual({
            nombreSocio: 1,
            numeroSocio: 2,
            fechaDePrestamo: 3,
            autor: 4,
            titulo: 5,
            numeroInventario: 6,
            itemType: 7,
            literaryForm: 8,
            edition: 9,
            placeOfPublication: 10,
            publisher: 11,
            publicationYear: 12,
            homeBranch: 13,
            holdingBranch: 14,
            publicNote: 15,
            callNumber: 16,
            authorCountry: 17,
            barcode: 18,
            dewey: 19,
            fechaDeIngreso: 20,
            literaryGenres: 21,
        })
    })
})
