import { describe, it, expect } from 'vitest'
import {
    quitarTildes,
    quitarSignos,
    limpiarTexto,
    tokenizar,
    quitarPalabrasIgnoradas,
    normalizarParaBusqueda,
} from '@/store/buscarLibro/normalizar'

describe('quitarTildes', () => {
    it('Quita tildes y dieresis', () => {
        expect(quitarTildes('canción pingüino ÁRBOL')).toBe('cancion pinguino ARBOL')
    })

    it('La ñ cuenta como n', () => {
        expect(quitarTildes('España Ñandú')).toBe('Espana Nandu')
    })
})

describe('quitarSignos', () => {
    it('Reemplaza lo que no es letra o numero por espacio', () => {
        expect(quitarSignos('¿Quién?:el-libro(2da.ed.)"uno"/dos'))
            .toBe(' Quién  el libro 2da ed   uno  dos')
    })
})

describe('limpiarTexto', () => {
    it('Pasa a minusculas, sin tildes, sin signos y con espacios simples', () => {
        expect(limpiarTexto('  El Principito (Edición ILUSTRADA) - Saint-Exupéry  '))
            .toBe('el principito edicion ilustrada saint exupery')
    })
})

describe('tokenizar', () => {
    it('Separa en palabras sin vacios', () => {
        expect(tokenizar(' cien  anos de soledad ')).toEqual(['cien', 'anos', 'de', 'soledad'])
    })

    it('Texto vacio no tiene palabras', () => {
        expect(tokenizar('   ')).toEqual([])
    })
})

describe('quitarPalabrasIgnoradas', () => {
    it('Quita articulos y preposiciones en cualquier posicion', () => {
        expect(quitarPalabrasIgnoradas(['la', 'casa', 'de', 'los', 'espiritus']))
            .toEqual(['casa', 'espiritus'])
    })

    it('Quita toda la lista de palabras ignoradas', () => {
        const ignoradas = ['el', 'la', 'los', 'las', 'lo', 'un', 'una', 'unos', 'unas', 'de', 'del', 'y', 'e', 'a', 'al', 'en']
        expect(quitarPalabrasIgnoradas([...ignoradas, 'sol'])).toEqual(['sol'])
    })

    it('Si todas son ignoradas las usa igual', () => {
        expect(quitarPalabrasIgnoradas(['de', 'la'])).toEqual(['de', 'la'])
    })
})

describe('normalizarParaBusqueda', () => {
    it('Devuelve las palabras significativas del texto', () => {
        expect(normalizarParaBusqueda('Las Venas Abiertas de América Latina')).toEqual(['venas', 'abiertas', 'america', 'latina'])
    })

    it('Los signos no separan resultados distintos', () => {
        expect(normalizarParaBusqueda('Rayuela: (novela)')).toEqual(normalizarParaBusqueda('rayuela novela'))
    })
})
