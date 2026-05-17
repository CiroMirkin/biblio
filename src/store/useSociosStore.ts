import { create } from "zustand"
import type { Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { getApellido, levenshtein } from "@/utils"
import { getRelevanciaDelApellido } from "@/utils/getRelevanciaDelApellido"

interface SociosState {
    socios: Socio[]
    sociosFiltrados: Socio[]
    socioSeleccionado: Socio | null
    mesesCuotas: Record<string, boolean>[]
    anio: number
    cuotas: boolean

    inicializar: () => Promise<void>
    buscar: (apellido: string) => void
    seleccionar: (socio: Socio) => void
    toggleMes: (mesIndex: number) => Promise<void>
    irAnioAnterior: () => void
    irAnioSiguiente: () => void
}

export const useSociosStore = create<SociosState>((set, get) => ({
    socios: [],
    sociosFiltrados: [],
    socioSeleccionado: null,
    mesesCuotas: [],
    anio: new Date().getFullYear(),
    cuotas: false,

    inicializar: async () => {
        const socios = await cargarSocios()
        const ordenados = ordenarSociosAlfabeticamente(socios)
        set({ socios: ordenados, sociosFiltrados: ordenados })
    },

    buscar: (apellido) => {
        const { socios } = get()

        if (!apellido.trim()) {
            set({ sociosFiltrados: socios, cuotas: false })
            return
        }

        const query = apellido.toLowerCase().trim()

        const filtrados = socios.filter(socio => {
            const apellido = getApellido(socio.nombreYApellido)
            if (apellido.includes(query)) return true

            return apellido.split(' ').some(palabra => {
                if (palabra.startsWith(query)) return true
                if (query.length < 5) return false
                if (Math.abs(palabra.length - query.length) > 1) return false
                return levenshtein(palabra, query) <= 1
            })
        })

        const ordenados = filtrados.sort((a, b) => {
            return getRelevanciaDelApellido(b.nombreYApellido, query) - getRelevanciaDelApellido(a.nombreYApellido, query)
        })

        set({ sociosFiltrados: ordenados, cuotas: false })
    },

    seleccionar: async (socio) => {
        const { anio } = get()
        const mesesCuotas = await cargarCuotasSocio(socio.nroSocio, anio)
        set({ socioSeleccionado: socio, cuotas: true, mesesCuotas })
    },

    toggleMes: async (mesIndex) => {
        const { socioSeleccionado, anio, mesesCuotas } = get()
        if (!socioSeleccionado) return

        const pagado = await window.electronAPI.toggleCuota(socioSeleccionado.nroSocio, anio, mesIndex)

        const next = [...mesesCuotas]
        const key = Object.keys(next[mesIndex])[0]
        next[mesIndex] = { [key]: pagado }
        set({ mesesCuotas: next })
    },

    irAnioAnterior: async () => {
        const { socioSeleccionado, anio } = get()
        if (!socioSeleccionado) return
        const nuevoAnio = anio - 1
        const mesesCuotas = await cargarCuotasSocio(socioSeleccionado.nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, mesesCuotas })
    },

    irAnioSiguiente: async () => {
        const { socioSeleccionado, anio } = get()
        if (!socioSeleccionado) return
        const nuevoAnio = anio + 1
        const mesesCuotas = await cargarCuotasSocio(socioSeleccionado.nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, mesesCuotas })
    },
}))
