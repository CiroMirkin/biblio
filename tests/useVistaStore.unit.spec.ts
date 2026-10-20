import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Socio } from '@shared/models'
import { useSociosStore } from '@/store/useSociosStore'
import { useVistaStore } from '@/store/useVistaStore'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const socio = {
    nroSocio: 1,
    nombreYApellido: 'Perez, Juan',
    caracterSocio: 'Regular',
    fechaIngreso: '1/1/2020',
    sociosVinculados: [],
} as unknown as Socio

const vistaInicial = useVistaStore.getState()

const esperarVista = () => new Promise(r => setTimeout(r, 0))

describe('useVistaStore', () => {
    let getCuotasSocio: ReturnType<typeof vi.fn>

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(new Date(2026, 9, 15))

        // ningun mes pago, el socio supera el maximo de cuotas adeudadas
        getCuotasSocio = vi.fn(async (_nro: number, anio = 2026) => ({
            anio,
            meses: MESES.map(m => ({ [m]: false })),
        }))
        ;(globalThis as any).window = {
            electronAPI: { getCuotasSocio, darDeBajaSocio: vi.fn(async () => true) },
        }

        useSociosStore.setState({ socios: [socio] })
        useVistaStore.setState(vistaInicial, true)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('verSocio abre el detalle recien despues de preparar al socio', async () => {
        useVistaStore.getState().ir('catalogo')
        useVistaStore.getState().verSocio(1)
        expect(useVistaStore.getState().socios).toEqual({ modo: 'lista' })

        await esperarVista()

        expect(getCuotasSocio).toHaveBeenCalled()
        expect(useVistaStore.getState().vistaActual).toBe('socios')
        expect(useVistaStore.getState().socios).toEqual({ modo: 'detalle', nroSocio: 1 })
    })

    it('Con un prestamo sin registrar la navegacion queda pendiente', async () => {
        useVistaStore.getState().verSocio(1)
        await esperarVista()
        useVistaStore.setState({ hayPrestamoSinRegistrar: () => true })

        useVistaStore.getState().ir('ajustes')

        expect(useVistaStore.getState().vistaActual).toBe('socios')
        expect(useVistaStore.getState().salidaPendiente).not.toBeNull()

        useVistaStore.getState().salidaPendiente!()
        expect(useVistaStore.getState().vistaActual).toBe('ajustes')
    })

    it('Ir a socios vuelve a la lista', async () => {
        useVistaStore.getState().verSocio(1)
        await esperarVista()

        useVistaStore.getState().ir('socios')

        expect(useVistaStore.getState().socios).toEqual({ modo: 'lista' })
    })

    it('El socio seleccionado refleja la baja automatica al abrirlo', async () => {
        useVistaStore.getState().verSocio(1)
        await esperarVista()

        const vista = useVistaStore.getState().socios
        const nro = vista.modo === 'detalle' ? vista.nroSocio : null
        const seleccionado = useSociosStore.getState().socios.find(s => s.nroSocio === nro)

        expect(seleccionado?.caracterSocio).toBe('Inactivo')
    })
})
