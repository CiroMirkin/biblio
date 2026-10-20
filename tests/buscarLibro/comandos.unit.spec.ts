import { describe, it, expect } from 'vitest'
import type { LibroRegistrado } from '@shared/models'
import { esComando, ejecutarComando } from '@/store/buscarLibro/comandos'

const libro = (numeroInventario: number, fechaDePrestamo: Date | null = null) =>
    ({ numeroInventario, titulo: `Libro ${numeroInventario}`, fechaDePrestamo }) as unknown as LibroRegistrado

describe('esComando', () => {
    it('Un guion al inicio es un comando', () => {
        expect(esComando('- prestamos de hoy')).toBe(true)
        expect(esComando('  -prestamos de hoy')).toBe(true)
    })

    it('Un guion en otra posicion no es un comando', () => {
        expect(esComando('saint-exupery')).toBe(false)
    })
})

describe('ejecutarComando', () => {
    it('Prestamos de hoy', () => {
        const hoy = libro(1, new Date())
        const ayer = libro(2, new Date(Date.now() - 86_400_000))
        expect(ejecutarComando('- Prestamos de hoy', [hoy, ayer, libro(3)])).toEqual([hoy])
    })

    it('Numeros de inventario repetidos', () => {
        const a = libro(5), b = libro(5), c = libro(6)
        expect(ejecutarComando('-numeros de inventario repetidos', [a, c, b])).toEqual([a, b])
    })

    it('Un comando desconocido no devuelve libros', () => {
        expect(ejecutarComando('- algo', [libro(1)])).toEqual([])
    })
})
