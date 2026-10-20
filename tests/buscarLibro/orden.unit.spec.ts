import { describe, it, expect } from 'vitest'
import type { LibroRegistrado } from '@shared/models'
import { normalizarLibro, normalizarParaBusqueda } from '@/store/buscarLibro/normalizar'
import { NIVEL, nivelAnd, ordenarPorNivel, ordenarOr, compararTitulos } from '@/store/buscarLibro/orden'

const libro = (titulo: string, autor = '') => ({ titulo, autor }) as LibroRegistrado
const nivel = (busqueda: string, titulo: string, autor = '') =>
    nivelAnd(normalizarParaBusqueda(busqueda), normalizarLibro(libro(titulo, autor)))

describe('nivelAnd', () => {
    it('Titulo igual a la busqueda sin palabras ignoradas', () => {
        expect(nivel('principito', 'El Principito')).toBe(NIVEL.TITULO_EXACTO)
    })

    it('Titulo que empieza con la busqueda', () => {
        expect(nivel('cien anos', 'Cien años de soledad')).toBe(NIVEL.TITULO_EMPIEZA)
    })

    it('Todas las palabras en el titulo', () => {
        expect(nivel('soledad cien', 'Cien años de soledad')).toBe(NIVEL.TODO_EN_TITULO)
    })

    it('Palabras repartidas entre titulo y autor', () => {
        expect(nivel('garcia marquez cien', 'Cien años de soledad', 'García Márquez, Gabriel')).toBe(NIVEL.TITULO_Y_AUTOR)
    })

    it('Todas las palabras en el autor', () => {
        expect(nivel('garcia marquez', 'Cien años de soledad', 'García Márquez, Gabriel')).toBe(NIVEL.TODO_EN_AUTOR)
    })

    it('Solo coincide por tolerancia a errores', () => {
        expect(nivel('soledat', 'Cien años de soledad')).toBe(NIVEL.TOLERANCIA)
    })

    it('Si falta alguna palabra no hay nivel', () => {
        expect(nivel('garcia marquez rayuela', 'Cien años de soledad', 'García Márquez, Gabriel')).toBeNull()
    })
})

describe('compararTitulos', () => {
    it('Ordena alfabeticamente sin importar tildes ni mayusculas', () => {
        const titulos = [libro('Ficciones'), libro('ángeles'), libro('Bestiario')]
        expect(titulos.sort(compararTitulos).map(l => l.titulo)).toEqual(['ángeles', 'Bestiario', 'Ficciones'])
    })
})

describe('ordenarPorNivel', () => {
    it('Ordena por nivel y desempata por titulo', () => {
        const a = libro('Zama'), b = libro('Bestiario'), c = libro('Aura')
        expect(ordenarPorNivel([
            { libro: a, nivel: NIVEL.TITULO_EXACTO },
            { libro: b, nivel: NIVEL.TODO_EN_AUTOR },
            { libro: c, nivel: NIVEL.TODO_EN_AUTOR },
        ])).toEqual([a, c, b])
    })
})

describe('ordenarOr', () => {
    it('Primero coincidencias en el titulo y despues solo en el autor', () => {
        const rayuela = libro('Rayuela')
        const cien = libro('Cien años de soledad')
        const amor = libro('El amor en los tiempos del cólera')
        expect(ordenarOr([
            { libro: cien, enTitulo: 0, enAutor: 2 },
            { libro: rayuela, enTitulo: 1, enAutor: 0 },
            { libro: amor, enTitulo: 0, enAutor: 2 },
        ])).toEqual([rayuela, cien, amor])
    })

    it('Dentro del grupo ordena por cantidad de coincidencias', () => {
        const uno = libro('A'), dos = libro('B')
        expect(ordenarOr([
            { libro: uno, enTitulo: 1, enAutor: 0 },
            { libro: dos, enTitulo: 1, enAutor: 1 },
        ])).toEqual([dos, uno])
    })
})
