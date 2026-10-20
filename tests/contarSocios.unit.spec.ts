import { describe, it, expect } from 'vitest'
import type { Socio } from '@shared/models'
import { contarSocios } from '@/store/useRecuentoSocios'

const socio = (nroSocio: number, caracterSocio: string) => ({ nroSocio, caracterSocio }) as Socio

describe('contarSocios', () => {
    it('Cuenta como inactivos a los dados de baja y a los de cuotas desactualizadas', () => {
        const socios = [
            socio(1, 'Regular'),
            socio(2, ''),
            socio(3, 'Inactivo'),
            socio(4, 'cuotas-desactualizadas'),
        ]

        expect(contarSocios(socios)).toEqual({ activos: 2, inactivos: 2 })
    })

    it('Dar de baja dos veces al mismo socio no desfasa el recuento', () => {
        const socios = [socio(1, 'Inactivo'), socio(2, 'Regular')]
        const otraVez = socios.map(s => s.nroSocio === 1 ? { ...s, caracterSocio: 'Inactivo' } : s)

        expect(contarSocios(otraVez)).toEqual({ activos: 1, inactivos: 1 })
    })
})
