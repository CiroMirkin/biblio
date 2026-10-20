import { describe, it, expect } from 'vitest'
import { levenshtein } from '@/utils/levenshtein'

describe('levenshtein', () => {
    it('Palabras iguales tienen distancia 0', () => {
        expect(levenshtein('soledad', 'soledad')).toBe(0)
    })

    it('Cuenta una sustitucion', () => {
        expect(levenshtein('garcia', 'garsia')).toBe(1)
    })

    it('Cuenta una letra de menos', () => {
        expect(levenshtein('rayuela', 'rayela')).toBe(1)
    })

    it('Cuenta una letra de mas', () => {
        expect(levenshtein('ficciones', 'ficcioness')).toBe(1)
    })
})
