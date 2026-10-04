import { useMemo } from "react"
import { create } from "zustand"
import { useSociosStore } from "./useSociosStore"
import { useLibrosStore } from "./useLibrosStore"

export type Vista = 'socios' | 'inscripcion' | 'catalogo' | 'ingreso' | 'ajustes'

type VistaSocios = { modo: 'lista' } | { modo: 'detalle', nroSocio: number }

type VistaCatalogo =
    | { modo: 'lista' }
    | { modo: 'editar', nroInventario: string }
    | { modo: 'historial', nroInventario: string }

interface VistaState {
    vistaActual: Vista
    socios: VistaSocios
    catalogo: VistaCatalogo

    ir: (vista: Vista) => void
    verSocio: (nroSocio: number) => void
    verListaSocios: () => void

    verEditarLibro: (nroInventario?: number | string) => void
    verHistorialLibro: (nroInventario?: number | string) => void
    verCatalogo: () => void

    // la tabla de prestamos lo reemplaza mientras esta montada
    hayPrestamoSinRegistrar: () => boolean
    salidaPendiente: (() => void) | null
    cancelarSalida: () => void
}

export const useVistaStore = create<VistaState>((set, get) => {
    // toda navegacion que deja el detalle del socio pasa por el aviso de prestamo sin registrar
    const salirDeSocio = (accion: () => void) => {
        const { vistaActual, socios, hayPrestamoSinRegistrar } = get()
        const enDetalle = vistaActual === 'socios' && socios.modo === 'detalle'
        if (enDetalle && hayPrestamoSinRegistrar()) set({ salidaPendiente: accion })
        else accion()
    }

    return {
        vistaActual: 'socios',
        socios: { modo: 'lista' },
        catalogo: { modo: 'lista' },
        hayPrestamoSinRegistrar: () => false,
        salidaPendiente: null,

        ir: (vista) => salirDeSocio(() => {
            if (vista === 'socios') {
                useSociosStore.getState().buscar("")
                set({ vistaActual: vista, socios: { modo: 'lista' } })
            }
            else if (vista === 'catalogo') set({ vistaActual: vista, catalogo: { modo: 'lista' } })
            else set({ vistaActual: vista })
        }),

        verSocio: (nroSocio) => salirDeSocio(async () => {
            await useSociosStore.getState().prepararSocio(nroSocio)
            set({ vistaActual: 'socios', socios: { modo: 'detalle', nroSocio } })
        }),

        verListaSocios: () => salirDeSocio(() => set({ socios: { modo: 'lista' } })),

        verEditarLibro: (nro) => set({ catalogo: { modo: 'editar', nroInventario: String(nro ?? "") } }),
        verHistorialLibro: (nro) => set({ catalogo: { modo: 'historial', nroInventario: String(nro ?? "") } }),
        verCatalogo: () => set({ catalogo: { modo: 'lista' } }),

        cancelarSalida: () => set({ salidaPendiente: null }),
    }
})

export const useSocioSeleccionado = () => {
    const vista = useVistaStore(s => s.socios)
    const nroSocio = vista.modo === 'detalle' ? vista.nroSocio : null
    return useSociosStore(s => s.socios.find(socio => socio.nroSocio === nroSocio) ?? null)
}

export const useSociosVinculados = () => {
    const socio = useSocioSeleccionado()
    const socios = useSociosStore(s => s.socios)
    return useMemo(
        () => socio ? socios.filter(s => socio.sociosVinculados.includes(s.nroSocio)) : [],
        [socio, socios],
    )
}

export const useLibroSeleccionado = () => {
    const vista = useVistaStore(s => s.catalogo)
    const nro = vista.modo === 'lista' ? null : vista.nroInventario
    return useLibrosStore(s => s.libros.find(l => String(l.numeroInventario) === nro) ?? null)
}
