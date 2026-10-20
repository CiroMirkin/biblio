import { describe, it, expect } from 'vitest'
import {
    coincidePorPrefijo,
    coincidePorTolerancia,
    coincidePalabra,
    coincidenTodas,
    contarCoincidencias,
} from '@/store/buscarLibro/coincidencia'

describe('coincidePorPrefijo', () => {
    it('La palabra empieza con lo buscado', () => {
        expect(coincidePorPrefijo('cort', 'cortazar')).toBe(true)
    })

    it('No coincide si lo buscado esta en el medio', () => {
        expect(coincidePorPrefijo('tazar', 'cortazar')).toBe(false)
    })
})

describe('coincidePorTolerancia', () => {
    it('Palabras de menos de 5 letras no toleran errores', () => {
        expect(coincidePorTolerancia('sol', 'sal')).toBe(false)
    })

    it('Desde 5 letras tolera 1 error', () => {
        expect(coincidePorTolerancia('garsia', 'garcia')).toBe(true)
        expect(coincidePorTolerancia('garsya', 'garcia')).toBe(false)
    })

    it('Desde 8 letras tolera 2 errores', () => {
        expect(coincidePorTolerancia('kortasar', 'cortazar')).toBe(true)
        expect(coincidePorTolerancia('kortasat', 'cortazar')).toBe(false)
    })
})

describe('coincidePalabra', () => {
    it('Coincide por prefijo o por tolerancia', () => {
        expect(coincidePalabra('ray', 'rayuela')).toBe(true)
        expect(coincidePalabra('rayela', 'rayuela')).toBe(true)
        expect(coincidePalabra('ficciones', 'rayuela')).toBe(false)
    })
})

describe('coincidenTodas', () => {
    it('Cada palabra buscada tiene que coincidir con alguna', () => {
        expect(coincidenTodas(['garcia', 'cien'], ['cien', 'anos', 'soledad', 'garcia', 'marquez'])).toBe(true)
        expect(coincidenTodas(['garcia', 'rayuela'], ['cien', 'anos', 'soledad', 'garcia', 'marquez'])).toBe(false)
    })

    it('Acepta otra forma de coincidir', () => {
        expect(coincidenTodas(['rayela'], ['rayuela'], coincidePorPrefijo)).toBe(false)
    })
})

describe('contarCoincidencias', () => {
    it('Cuenta las palabras buscadas que coinciden', () => {
        expect(contarCoincidencias(['garcia', 'marquez', 'rayuela'], ['garcia', 'marquez'])).toBe(2)
    })
})
