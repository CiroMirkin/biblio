import { create } from "zustand"
import type { NewSocio, Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { calcularCuotasAdeudadas, getApellido, levenshtein } from "@/utils"
import { getRelevanciaDelApellido } from "@/utils/getRelevanciaDelApellido"
import { settingsService } from "@/services"
import { getCaracterSocio } from "@/models"

interface SociosState {
    socios: Socio[]
    sociosFiltrados: Socio[]
    socioSeleccionado: Socio | null
    mesesCuotas: Record<string, boolean>[]
    anio: number
    cuotas: boolean
    maximoDeCuotasAdeudadas: number

    inicializar: () => Promise<void>
    buscar: (apellido: string) => void
    seleccionar: (socio: Socio) => void
    toggleMes: (mesIndex: number) => Promise<void>
    irAnioAnterior: () => void
    irAnioSiguiente: () => void
    
    crearSocio: (socioData: NewSocio) => Promise<Socio | null>

    darDeBaja: () => Promise<void>
    reactivar: () => Promise<void>
    setObservaciones: (newObservaciones: string) => Promise<void>
    setMaximoDeCuotasAdeudadas: (newMaximo: number) => number
}

export const useSociosStore = create<SociosState>((set, get) => ({
    socios: [],
    sociosFiltrados: [],
    socioSeleccionado: null,
    mesesCuotas: [],
    anio: new Date().getFullYear(),
    cuotas: false,
    maximoDeCuotasAdeudadas: 1,

    inicializar: async () => {
        const socios = await cargarSocios()
        const ordenados = ordenarSociosAlfabeticamente(socios)
        const settings = await settingsService.getAll()
        set({
            socios: ordenados,
            sociosFiltrados: ordenados,
            maximoDeCuotasAdeudadas: settings.maximoDeCuotasAdeudadas ?? 6,
        })
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
        const { anio, maximoDeCuotasAdeudadas, darDeBaja, reactivar } = get()
        const mesesCuotas = await cargarCuotasSocio(socio.nroSocio, anio)

        if(getCaracterSocio(socio.caracterSocio).estado) {
            // baja si 6 >= 6 || 8 >= 6  
            if(calcularCuotasAdeudadas(mesesCuotas) >= maximoDeCuotasAdeudadas) {
                darDeBaja()
            }
        }
        else if(!getCaracterSocio(socio.caracterSocio).estado) {
            // alta si 3 <= 6  
            if(calcularCuotasAdeudadas(mesesCuotas) <= maximoDeCuotasAdeudadas) {
                reactivar()
            }
        }

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

    darDeBaja: async () => {
        const { socioSeleccionado, socios, sociosFiltrados } = get()
        if (!socioSeleccionado) return

        const ok = await window.electronAPI.darDeBajaSocio(socioSeleccionado.nombreYApellido)
        if (!ok) return

        const actualizado = { ...socioSeleccionado, caracterSocio: 'Inactivo' }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            socioSeleccionado: actualizado,
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
        })
    },

    setMaximoDeCuotasAdeudadas: (newMaximo) => {
        const { maximoDeCuotasAdeudadas } = get()
        if(newMaximo <= 1) return maximoDeCuotasAdeudadas

        set({
            maximoDeCuotasAdeudadas: newMaximo
        })
        settingsService.set('maximoDeCuotasAdeudadas', newMaximo)
        return newMaximo
    },

    reactivar: async () => {
        const { socioSeleccionado, socios, sociosFiltrados } = get()
        if (!socioSeleccionado) return

        const ok = await window.electronAPI.reactivarSocio(socioSeleccionado.nombreYApellido)
        if (!ok) return

        const actualizado = { ...socioSeleccionado, caracterSocio: 'Regular' }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            socioSeleccionado: actualizado,
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
        })
    },

    setObservaciones: async (newObservaciones: string) => {
        const { socioSeleccionado, socios, sociosFiltrados } = get()
        if (!socioSeleccionado) return

        const ok = await window.electronAPI.changeObservaciones(
            newObservaciones,
            socioSeleccionado.nombreYApellido,
        )
        if (!ok) return

        const actualizado = { ...socioSeleccionado, observaciones: newObservaciones }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            socioSeleccionado: actualizado,
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
        })
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

    crearSocio: async (socioData) => {
        const { socios, sociosFiltrados } = get()

        const nuevoSocio = await window.electronAPI.createSocio(socioData)
        if (!nuevoSocio) return null

        const actualizarLista = (lista: Socio[]) =>
            ordenarSociosAlfabeticamente([...lista, nuevoSocio])

        set({
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
            socioSeleccionado: nuevoSocio,
            cuotas: true,
            mesesCuotas: [],
        })

        return nuevoSocio
    },
}))
