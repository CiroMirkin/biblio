import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Socio } from '@shared/models'
import { useCuotasStore } from '@/store/useCuotasStore'
import { useSociosStore } from '@/store/useSociosStore'
import { useSettingsStore } from '@/store/useSettingsStore'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const socio = {
    nroSocio: 1,
    nombreYApellido: 'Perez, Juan',
    caracterSocio: 'Regular',
    fechaIngreso: '1/1/2020',
    sociosVinculados: [],
} as unknown as Socio

const cuotasInicial = useCuotasStore.getState()

// pagos hasta el mes indicado inclusive, -1 es ningun mes pago
const calendario = (pagoHasta: number) => MESES.map((m, i) => ({ [m]: i <= pagoHasta }))

describe('useCuotasStore', () => {
    let getCuotasSocio: ReturnType<typeof vi.fn>
    let darDeBajaSocio: ReturnType<typeof vi.fn>
    let toggleCuota: ReturnType<typeof vi.fn>

    const conPagosHasta = (pagoHasta: number) => {
        getCuotasSocio = vi.fn(async (_nro: number, anio = 2026) => ({ anio, meses: calendario(pagoHasta) }))
        ;(globalThis as any).window.electronAPI.getCuotasSocio = getCuotasSocio
    }

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(new Date(2026, 9, 15))

        darDeBajaSocio = vi.fn(async () => true)
        toggleCuota = vi.fn(async () => true)
        ;(globalThis as any).window = { electronAPI: { darDeBajaSocio, toggleCuota } }
        conPagosHasta(-1)

        useSettingsStore.setState({ gestionDeCuotas: true, maximoDeCuotasAdeudadas: 6 })
        useSociosStore.setState({ socios: [socio] })
        useCuotasStore.setState(cuotasInicial, true)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Abrir carga el año y da de baja a quien supera el maximo de cuotas adeudadas', async () => {
        await useCuotasStore.getState().abrir(1)

        expect(useCuotasStore.getState()).toMatchObject({ nroSocio: 1, anio: 2026 })
        expect(useCuotasStore.getState().meses).toHaveLength(12)
        expect(getCuotasSocio).toHaveBeenCalledTimes(1)
        expect(darDeBajaSocio).toHaveBeenCalledWith(1)
        expect(useSociosStore.getState().socios[0].caracterSocio).toBe('Inactivo')
    })

    it('Abrir no da de baja a quien esta al dia', async () => {
        conPagosHasta(8)

        await useCuotasStore.getState().abrir(1)

        expect(darDeBajaSocio).not.toHaveBeenCalled()
    })

    it('Abrir no vuelve a dar de baja a un socio inactivo', async () => {
        useSociosStore.setState({ socios: [{ ...socio, caracterSocio: 'Inactivo' }] })

        await useCuotasStore.getState().abrir(1)

        expect(darDeBajaSocio).not.toHaveBeenCalled()
    })

    it('Toggle marca el mes como pago', async () => {
        await useCuotasStore.getState().abrir(1)

        await useCuotasStore.getState().toggleMes(3)

        expect(toggleCuota).toHaveBeenCalledWith(1, 2026, 3)
        expect(useCuotasStore.getState().meses[3]).toEqual({ Abr: true })
    })

    it('Cambiar de año pide las cuotas de ese año', async () => {
        await useCuotasStore.getState().abrir(1)

        await useCuotasStore.getState().irAnioAnterior()

        expect(getCuotasSocio).toHaveBeenLastCalledWith(1, 2025)
        expect(useCuotasStore.getState().anio).toBe(2025)
    })

    it('Sin gestion de cuotas no pide nada', async () => {
        useSettingsStore.setState({ gestionDeCuotas: false })

        await useCuotasStore.getState().abrir(1)

        expect(getCuotasSocio).not.toHaveBeenCalled()
        expect(darDeBajaSocio).not.toHaveBeenCalled()
        expect(useCuotasStore.getState().nroSocio).toBe(1)
    })
})
