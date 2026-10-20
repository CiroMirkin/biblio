import { describe, it, expect } from 'vitest'
import { debeBuscar } from '@/store/buscarLibro/debeBuscar'

describe('debeBuscar', () => {
    it('Los numeros se buscan con cualquier largo', () => {
        expect(debeBuscar('7')).toBe(true)
        expect(debeBuscar('12')).toBe(true)
    })

    it('El texto se busca desde 3 caracteres', () => {
        expect(debeBuscar('so')).toBe(false)
        expect(debeBuscar('sol')).toBe(true)
    })

    it('Los signos y espacios no cuentan como caracteres', () => {
        expect(debeBuscar(' (s) ')).toBe(false)
    })

    it('Solo palabras ignoradas cortas no buscan', () => {
        expect(debeBuscar('el')).toBe(false)
        expect(debeBuscar('las')).toBe(false)
    })

    it('Solo palabras ignoradas buscan con mas de 3 caracteres', () => {
        expect(debeBuscar('de la')).toBe(true)
    })

    it('Los comandos siempre buscan', () => {
        expect(debeBuscar('-')).toBe(true)
        expect(debeBuscar('- prestamos de hoy')).toBe(true)
    })
})
