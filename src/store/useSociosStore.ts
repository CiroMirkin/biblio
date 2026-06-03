import { create } from "zustand"
import type { CaracterSocio, NewSocio, Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { calcularCuotasAdeudadas, getApellido, levenshtein } from "@/utils"
import { getRelevanciaDelApellido } from "@/utils/getRelevanciaDelApellido"
import { settingsService } from "@/services"
import { getCaracterSocio, type Calendario } from "@/models"

interface SociosState {
    socios: Socio[]
    sociosConLibros: Socio[]
    sociosFiltrados: Socio[]
    socioSeleccionado: Socio | null
    mesesCuotas: Calendario
    anio: number
    showDetallesSocio: boolean
    maximoDeCuotasAdeudadas: number
    sociosActivos: number,
    sociosInactivos: number,

    inicializar: () => Promise<void>
    buscar: (apellido: string) => void
    seleccionar: (socio: Socio) => void
    toggleMes: (mesIndex: number) => Promise<void>
    irAnioAnterior: () => void
    irAnioSiguiente: () => void
    
    crearSocio: (socioData: NewSocio) => Promise<Socio | null>

    darDeBaja: (socio: Socio, options?: { newCaracter?: CaracterSocio, esSocioSeleccionado?: boolean }) => Promise<void>
    reactivar: (socio: Socio, options?: { newCaracter?: CaracterSocio, esSocioSeleccionado?: boolean }) => Promise<void>

    darDeBajaSocioSeleccionado: () => Promise<void>
    reactivarSocioSeleccionado: () => Promise<void>
    aplicarCambioAutomaticoDeCaracter: (socio: Socio, mesesCuotas: Calendario) => Promise<void>
    actualizarCaracterSocios: () => Promise<void>

    setObservaciones: (newObservaciones: string) => Promise<void>
    setMaximoDeCuotasAdeudadas: (newMaximo: number) => number
    showListaSocios: () => void,
}

export const useSociosStore = create<SociosState>((set, get) => ({
    socios: [],
    sociosConLibros: [],
    sociosFiltrados: [],
    socioSeleccionado: null,
    mesesCuotas: [],
    anio: new Date().getFullYear(),
    showDetallesSocio: false,
    maximoDeCuotasAdeudadas: 1,
    sociosActivos: 0,
    sociosInactivos: 0,

    inicializar: async () => {
        const socios = await cargarSocios()
        const sociosRegistradosConLibros = await window.electronAPI.getSociosConLibros()
        const ordenados = ordenarSociosAlfabeticamente(socios)
        const settings = await settingsService.getAll()

        let [ sociosActivos, sociosInactivos ] = [ 0, 0 ]
        socios.forEach(s => {
            if(getCaracterSocio(s.caracterSocio).estado) sociosActivos++
            else sociosInactivos++
        })

        const sociosConLibros = ordenados.filter(s =>
            sociosRegistradosConLibros.some(sl => sl.nroSocio === s.nroSocio)
        )

        set({
            socios: ordenados,
            sociosConLibros,
            maximoDeCuotasAdeudadas: settings.maximoDeCuotasAdeudadas ?? 6,
            sociosActivos,
            sociosInactivos,
        })
    },

    buscar: (apellido) => {
        const { socios } = get()

        if (!apellido.trim()) {
            set({ sociosFiltrados: [], showDetallesSocio: false })
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

        set({ sociosFiltrados: ordenados, showDetallesSocio: false })
    },

    seleccionar: async (socio) => {
        const { anio } = get()
        const mesesCuotas = await cargarCuotasSocio(socio.nroSocio, anio)

        set({
            socioSeleccionado: socio,
            showDetallesSocio: true,
            mesesCuotas
        })
        await get().aplicarCambioAutomaticoDeCaracter(socio, mesesCuotas)
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

    darDeBaja: async (socio, { newCaracter, esSocioSeleccionado } = {}) => {
        const { socios, sociosFiltrados, sociosActivos, sociosInactivos } = get()

        const ok = await window.electronAPI.darDeBajaSocio(socio.nombreYApellido)
        if (!ok) return

        const caracterSocio: CaracterSocio = newCaracter ?? 'Inactivo'
        const actualizado = { ...socio, caracterSocio }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            ...(esSocioSeleccionado && { socioSeleccionado: actualizado }),
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
            sociosInactivos: sociosInactivos + 1,
            sociosActivos: sociosActivos - 1,
        })
    },

    reactivar: async (socio, { newCaracter, esSocioSeleccionado } = {}) => {
        const { socios, sociosFiltrados, sociosActivos, sociosInactivos } = get()

        const ok = await window.electronAPI.reactivarSocio(socio.nombreYApellido)
        if (!ok) return

        const caracterSocio: CaracterSocio = newCaracter ?? 'Regular'
        const actualizado = { ...socio, caracterSocio }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            ...(esSocioSeleccionado && { socioSeleccionado: actualizado }),
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
            sociosActivos: sociosActivos + 1,
            sociosInactivos: sociosInactivos - 1,
        })
    },

    darDeBajaSocioSeleccionado: async () => {
        const { socioSeleccionado } = get()
        if (!socioSeleccionado) return
        await get().darDeBaja(socioSeleccionado, { esSocioSeleccionado: true })
    },

    reactivarSocioSeleccionado: async () => {
        const { socioSeleccionado } = get()
        if (!socioSeleccionado) return
        await get().reactivar(socioSeleccionado, { esSocioSeleccionado: true })
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
            showDetallesSocio: true,
            mesesCuotas: [],
        })

        return nuevoSocio
    },

    actualizarCaracterSocios: async () => {
        const { socios, anio } = get()

        for (const socio of socios) {
            const mesesCuotas = await cargarCuotasSocio(socio.nroSocio, anio)
            await get().aplicarCambioAutomaticoDeCaracter(socio, mesesCuotas)
        }
    },

    aplicarCambioAutomaticoDeCaracter: async (socio: Socio, mesesCuotas: Calendario) => {
        const { maximoDeCuotasAdeudadas } = get()

        const caracterSocio = getCaracterSocio(socio.caracterSocio)

        if (!caracterSocio.permiteCambioAutomatico) return

        const cuotasAdeudadas = calcularCuotasAdeudadas(mesesCuotas)
        if (caracterSocio.caracter) {
            if (cuotasAdeudadas >= maximoDeCuotasAdeudadas) {
                await get().darDeBaja(socio, { newCaracter: "inactivo-automatico" })
            }
        }
        else if (cuotasAdeudadas <= maximoDeCuotasAdeudadas) {
            await get().reactivar(socio, { newCaracter: "regular-automatico" })
        }
    },

    showListaSocios: () => {
        const { showDetallesSocio } = get()
        if(!showDetallesSocio) return
        
        set({
            showDetallesSocio: false,
        })
    },
}))
