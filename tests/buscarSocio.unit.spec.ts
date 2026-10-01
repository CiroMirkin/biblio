import { describe, it, expect } from 'vitest'
import type { LibroRegistrado, Socio } from '@shared/models'
import { buscarSocio } from '@/store/buscarSocio'

const socios = [
    { nroSocio: 1, nombreYApellido: 'Perez, Juan' },
    { nroSocio: 2, nombreYApellido: 'Gomez, Ana' },
] as Socio[]

const libros = [
    { titulo: 'Rayuela', numeroSocio: 2, holding: { homeBranch: '', holdingBranch: '' } },
    { titulo: 'Rayuela', numeroSocio: null, holding: { homeBranch: '', holdingBranch: '' } },
    { titulo: 'Ficciones', numeroSocio: 1, holding: { homeBranch: '', holdingBranch: '' } },
] as LibroRegistrado[]

describe('buscarSocio por libro prestado', () => {
    it('Devuelve los socios que tienen el libro buscado', () => {
        expect(buscarSocio({ socios, libros, dato: 'prestamo rayuela' })).toEqual([socios[1]])
        expect(buscarSocio({ socios, libros, dato: 'prestamo ficciones' })).toEqual([socios[0]])
    })

    it('Sin coincidencias no devuelve socios', () => {
        expect(buscarSocio({ socios, libros, dato: 'prestamo inexistente' })).toEqual([])
    })
})
