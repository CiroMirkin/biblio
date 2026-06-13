import { create } from "zustand"
import type { CaracterSocio, NewSocio, Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { calcularCuotasAdeudadas } from "@/utils"
import { settingsService } from "@/services"
import { getCaracterSocio, type Calendario } from "@/models"
import { buscarSocio } from "./buscarSocio"

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
    editarDatos: (datos: Partial<Socio>) => Promise<void>
    cambiarNombre: (newName: string) => Promise<void>

    darDeBaja: (socio: Socio, options?: { esSocioSeleccionado?: boolean }) => Promise<void>
    reactivar: (socio: Socio, options?: { esSocioSeleccionado?: boolean }) => Promise<void>

    darDeBajaSocioSeleccionado: () => Promise<void>
    reactivarSocioSeleccionado: () => Promise<void>
    aplicarCambioAutomaticoDeCaracter: (socio: Socio) => Promise<void>

    setObservaciones: (newObservaciones: string) => Promise<void>
    setMaximoDeCuotasAdeudadas: (newMaximo: number) => number
    
    precioCuota: number
    setPrecioCuota: (newPrice: number) => number

    gestionDeCuotas: boolean
    toggleGestionDeCuotas: () => boolean
    
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
    precioCuota: 100,
    gestionDeCuotas: true,

    inicializar: async () => {
        const socios = await cargarSocios()
        const sociosRegistradosConLibros = await window.electronAPI.getSociosConLibros()
        const ordenados = ordenarSociosAlfabeticamente(socios)
        const settings = await settingsService.getAll()

        let [ sociosActivos, sociosInactivos ] = [ 0, 0 ]
        socios.forEach(s => {
            if(getCaracterSocio(s.caracterSocio).estado && !getCaracterSocio(s.caracterSocio).tieneCuotasDesactualizadas) sociosActivos++
            else sociosInactivos++
        })

        const sociosConLibros = ordenados.filter(s =>
            sociosRegistradosConLibros.some(sl => sl.nroSocio === s.nroSocio)
        )

        set({
            socios: ordenados,
            sociosConLibros,
            maximoDeCuotasAdeudadas: settings.maximoDeCuotasAdeudadas ?? 6,
            precioCuota: settings.precioCuota ?? 1000,
            sociosActivos,
            sociosInactivos,
            gestionDeCuotas: settings.gestionDeCuotas ?? true,
        })
    },

    buscar: (apellido) => {
        const { socios } = get()

        if (!apellido.trim()) {
            set({ sociosFiltrados: [], showDetallesSocio: false })
            return
        }

        const query = apellido.toLowerCase().trim()
        if(!query) set({ sociosFiltrados: [] })

        const filtrados = buscarSocio({ dato: query, socios })
        set({ sociosFiltrados: filtrados, showDetallesSocio: false })
    },

    seleccionar: async (socio) => {
        const { anio, meses: mesesCuotas } = await cargarCuotasSocio(socio.nroSocio)
        await get().aplicarCambioAutomaticoDeCaracter(socio)
        
        set({
            socioSeleccionado: socio,
            showDetallesSocio: true,
            mesesCuotas,
            anio,
        })        
    },

    editarDatos: async (datos) => {
        const { socioSeleccionado, socios, sociosFiltrados } = get()
        if (!socioSeleccionado || !socioSeleccionado.nroSocio) return

        const ok = await window.electronAPI.editarDatosSocio(socioSeleccionado.nroSocio, datos)
        if (!ok) return

        const actualizado = { ...socioSeleccionado, ...datos }

        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            socioSeleccionado: actualizado,
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
        })
    },

    toggleMes: async (mesIndex) => {
        const { socioSeleccionado, anio, mesesCuotas, reactivar } = get()
        if (!socioSeleccionado) return

        // PARA MIGRACION: permite que luego de actualizar las cuotas el caracter se defina automaticamente
        if(getCaracterSocio(socioSeleccionado.caracterSocio).tieneCuotasDesactualizadas) {
            await reactivar(socioSeleccionado)
        }

        const pagado = await window.electronAPI.toggleCuota(socioSeleccionado.nroSocio, anio, mesIndex)

        const next = [...mesesCuotas]
        const key = Object.keys(next[mesIndex])[0]
        next[mesIndex] = { [key]: pagado }
        set({ mesesCuotas: next })
    },

    darDeBaja: async (socio, { esSocioSeleccionado } = {}) => {
        const { socios, sociosFiltrados, sociosActivos, sociosInactivos } = get()

        const ok = await window.electronAPI.darDeBajaSocio(socio.nroSocio)
        if (!ok) return

        const caracterSocio: CaracterSocio =  'Inactivo'
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

    reactivar: async (socio, { esSocioSeleccionado } = {}) => {
        const { socios, sociosFiltrados, sociosActivos, sociosInactivos } = get()

        const ok = await window.electronAPI.reactivarSocio(socio.nroSocio)
        if (!ok) return

        const caracterSocio: CaracterSocio =  'Regular'
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

    setPrecioCuota: (newPrice: number) =>  {
        const { precioCuota } = get()
        if(newPrice <= 1) return precioCuota

        set({
            precioCuota: newPrice
        })
        settingsService.set('precioCuota', newPrice)
        return newPrice
    },

    toggleGestionDeCuotas: () => {
        const { gestionDeCuotas } = get()

        if(gestionDeCuotas) {
            set({ gestionDeCuotas: false })
            settingsService.set('gestionDeCuotas', false)
            return false
        }

        set({ gestionDeCuotas: true })
        settingsService.set('gestionDeCuotas', true)
        return true
    },
    
    setObservaciones: async (newObservaciones: string) => get().editarDatos({ observaciones: newObservaciones }),
    
    cambiarNombre: async (newName: string) => {
        const { socioSeleccionado: socio, socios, sociosFiltrados } = get()
        if(!socio || !socio.nroSocio || !newName.trim()) return

        const ok = await window.electronAPI.cambiarNombreSocio(
            socio.nroSocio, newName,
        )
        if(!ok) return 
        
        const actualizado = { ...socio, nombreYApellido: newName, }
        const actualizarLista = (lista: Socio[]) =>
            lista.map(s => s.nroSocio === actualizado.nroSocio ? actualizado : s)

        set({
            socioSeleccionado: { ...actualizado },    
            socios: actualizarLista(socios),
            sociosFiltrados: actualizarLista(sociosFiltrados),
        })
    },

    irAnioAnterior: async () => {
        const { socioSeleccionado, anio } = get()
        if (!socioSeleccionado) return
        const nuevoAnio = anio - 1
        const mesesCuotas = await cargarCuotasSocio(socioSeleccionado.nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, mesesCuotas: mesesCuotas.meses })
    },

    irAnioSiguiente: async () => {
        const { socioSeleccionado, anio } = get()
        if (!socioSeleccionado) return
        const nuevoAnio = anio + 1
        const { meses } = await cargarCuotasSocio(socioSeleccionado.nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, mesesCuotas: meses })
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

    aplicarCambioAutomaticoDeCaracter: async (socio: Socio) => {
        const { maximoDeCuotasAdeudadas, gestionDeCuotas } = get()

        const caracterSocio = getCaracterSocio(socio.caracterSocio)

        if(!gestionDeCuotas) return
        if (caracterSocio.tieneCuotasDesactualizadas) return

        const cuotasAdeudadas = await calcularCuotasAdeudadas(socio.nroSocio)
        if (caracterSocio.caracter) {
            if (cuotasAdeudadas > maximoDeCuotasAdeudadas) {
                await get().darDeBaja(socio)
            }
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
