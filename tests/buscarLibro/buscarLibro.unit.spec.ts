import { describe, it, expect } from 'vitest'
import type { LibroRegistrado } from '@shared/models'
import { buscarLibro } from '@/store/buscarLibro'

let nro = 100
const libro = (titulo: string, autor = '') => ({ numeroInventario: nro++, titulo, autor }) as unknown as LibroRegistrado

const cien = libro('Cien años de soledad', 'García Márquez, Gabriel')
const amor = libro('El amor en los tiempos del cólera', 'García Márquez, Gabriel')
const rayuela = libro('Rayuela', 'Cortázar, Julio')
const casa = libro('La casa de los espíritus', 'Allende, Isabel')
const principito = libro('El principito (edición ilustrada)', 'Saint-Exupéry, Antoine de')
const orwell = libro('1984', 'Orwell, George')
const viento = libro('Lo que el viento se llevó', 'Mitchell, Margaret')
const conInventario = { ...libro('Ficciones', 'Borges, Jorge Luis'), numeroInventario: 1984 } as LibroRegistrado
const libros = [cien, amor, rayuela, casa, principito, orwell, viento, conInventario]

const buscar = (dato: string) => buscarLibro({ libros, dato })

describe('buscarLibro', () => {
    it('Los articulos no afectan la busqueda', () => {
        expect(buscar('casa espiritus')[0]).toBe(casa)
        expect(buscar('las casa de espiritus')[0]).toBe(casa)
        expect(buscar('principito el')[0]).toBe(principito)
    })

    it('Los signos no afectan la busqueda', () => {
        expect(buscar('saint exupery')).toEqual([principito])
        expect(buscar('principito: (edicion ilustrada)')).toEqual([principito])
    })

    it('Se puede buscar por el texto entre parentesis', () => {
        expect(buscar('ilustrada')).toEqual([principito])
    })

    it('Las tildes y la ñ de la busqueda no afectan', () => {
        expect(buscar('Cién Años')).toEqual([cien])
        expect(buscar('cien anos')).toEqual([cien])
    })

    it('Busqueda conjunta por autor y titulo', () => {
        expect(buscar('garcia marquez cien')).toEqual([cien])
    })

    it('Por autor trae todos sus libros ordenados por titulo', () => {
        expect(buscar('garcia marquez')).toEqual([cien, amor])
    })

    it('Si no coinciden todas las palabras, primero coincidencias por titulo y despues por autor', () => {
        expect(buscar('garcia marquez rayuela')).toEqual([rayuela, cien, amor])
    })

    it('Un numero busca por inventario y tambien por titulo', () => {
        expect(buscar('1984')).toEqual([conInventario, orwell])
    })

    it('Si todas las palabras son ignoradas las usa igual', () => {
        expect(buscar('lo que el')[0]).toBe(viento)
    })

    it('Tolera errores de tipeo', () => {
        expect(buscar('rayela')).toEqual([rayuela])
    })

    it('Los comandos siguen funcionando', () => {
        expect(buscar('- algo que no existe')).toEqual([])
    })
})
