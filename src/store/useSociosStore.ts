import { create } from "zustand"
import type { CaracterSocio } from "@/models/Socio"
import type { NewSocio, Socio } from "@shared/models"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { calcularCuotasAdeudadas } from "@/utils"
import { getCaracterSocio, type Calendario } from "@/models"
import { buscarSocio } from "./buscarSocio"
import { useSettingsStore } from "./useSettingsStore"

interface SociosState {
    socios: Socio[]
    sociosConLibros: Socio[]
    sociosFiltrados: Socio[]
    socioSeleccionado: Socio | null
    sociosVinculados: Socio[]
    mesesCuotas: Calendario
    anio: number
    showDetallesSocio: boolean
    sociosActivos: number
    sociosInactivos: number
    loadingSocios: boolean

    inicializar: () => Promise<void>
    buscar: (apellido: string, options?: {
        showDetallesSocio?: boolean,
    }) => void
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

    vincularSocio: (nroSocio: number) => Promise<boolean>
    desvincularSocio: (nroSocio: number) => Promise<boolean>
    verSocioVinculado: (nroSocio: number) => void

    showListaSocios: () => void
}

export const useSociosStore = create<SociosState>((set, get) => ({
    socios: [],
    sociosConLibros: [],
    sociosFiltrados: [],
    sociosVinculados: [],
    socioSeleccionado: null,
    mesesCuotas: [],
    anio: new Date().getFullYear(),
    showDetallesSocio: false,
    sociosActivos: 0,
    sociosInactivos: 0,
    loadingSocios: true,

    inicializar: async () => {
        const socios = await cargarSocios()
        const sociosRegistradosConLibros = await window.electronAPI.getSociosConLibros()
        const ordenados = ordenarSociosAlfabeticamente(socios)

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
            sociosActivos,
            sociosInactivos,
            sociosFiltrados: [...sociosConLibros],
            loadingSocios: false,
        })
    },

    buscar: (apellido, options = {}) => {
        const { socios, sociosConLibros } = get()
        const { showDetallesSocio } = options

        if (!apellido.trim()) {
            set({ sociosFiltrados: [...sociosConLibros], showDetallesSocio: showDetallesSocio !== false })
            return
        }

        const query = apellido.toLowerCase().trim()
        if(!query) set({ sociosFiltrados:  [...sociosConLibros] })

        const filtrados = buscarSocio({ dato: query, socios })
        set({ sociosFiltrados: filtrados, showDetallesSocio: showDetallesSocio !== false })
    },

    seleccionar: async (socio) => {
        const { anio, meses: mesesCuotas } = await cargarCuotasSocio(socio.nroSocio)
        await get().aplicarCambioAutomaticoDeCaracter(socio)

        const { socios } = get()
        const sociosVinculados = socios.filter(s => socio.sociosVinculados.includes(s.nroSocio))
        
        set({
            socioSeleccionado: socio,
            sociosVinculados: sociosVinculados,
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

        set({
            socioSeleccionado: actualizado,
            socios: actualizarSocioEnLista(actualizado, socios),
            sociosFiltrados: actualizarSocioEnLista(actualizado, sociosFiltrados),
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

        const caracterSocio: CaracterSocio = 'Inactivo'
        const actualizado = { ...socio, caracterSocio }

        set({
            ...(esSocioSeleccionado && { socioSeleccionado: actualizado }),
            socios: actualizarSocioEnLista(actualizado, socios),
            sociosFiltrados: actualizarSocioEnLista(actualizado, sociosFiltrados),
            sociosInactivos: sociosInactivos + 1,
            sociosActivos: sociosActivos - 1,
        })
    },

    reactivar: async (socio, { esSocioSeleccionado } = {}) => {
        const { socios, sociosFiltrados, sociosActivos, sociosInactivos } = get()

        const ok = await window.electronAPI.reactivarSocio(socio.nroSocio)
        if (!ok) return

        const caracterSocio: CaracterSocio = 'Regular'
        const actualizado = { ...socio, caracterSocio }

        set({
            ...(esSocioSeleccionado && { socioSeleccionado: actualizado }),
            socios: actualizarSocioEnLista(actualizado, socios),
            sociosFiltrados: actualizarSocioEnLista(actualizado, sociosFiltrados),
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

    setObservaciones: async (newObservaciones) => get().editarDatos({ observaciones: newObservaciones }),

    cambiarNombre: async (newName) => {
        const { socioSeleccionado: socio, socios, sociosFiltrados } = get()
        if(!socio || !socio.nroSocio || !newName.trim()) return

        const ok = await window.electronAPI.cambiarNombreSocio(
            socio.nroSocio, newName,
        )
        if(!ok) return 
        
        const actualizado = { ...socio, nombreYApellido: newName, }

        set({
            socioSeleccionado: { ...actualizado },    
            socios: actualizarSocioEnLista(actualizado, socios),
            sociosFiltrados: actualizarSocioEnLista(actualizado, sociosFiltrados),
        })
    },

    desvincularSocio: async (nroSocio: number) => {
        const { socioSeleccionado: socio_a, socios, sociosFiltrados, sociosVinculados } = get()
        if(!nroSocio || !socio_a || !socio_a.nroSocio) return false

        const socio_b = socios.filter(s => s.nroSocio === nroSocio)[0]
        if(!socio_b) return false

        const ok = await window.electronAPI.desvincularSocios(
            socio_b, socio_a,
        )

        if(!ok) return false

        const updatedSocio_a = {
            ...socio_a,
            sociosVinculados: socio_a.sociosVinculados.filter(nro => nro !== nroSocio),
        }

        const updatedSocio_b = {
            ...socio_b,
            sociosVinculados: socio_b.sociosVinculados.filter(nro => nro !== socio_a.nroSocio),
        }

        set({
            socioSeleccionado: updatedSocio_a,
            sociosVinculados: sociosVinculados.filter(s => s.nroSocio !== socio_b.nroSocio),
            socios: actualizarSocioEnLista(
                updatedSocio_a,
                actualizarSocioEnLista(updatedSocio_b, socios)
            ),
            sociosFiltrados: actualizarSocioEnLista(
                socio_a,
                actualizarSocioEnLista(updatedSocio_b, sociosFiltrados)
            ),
        })
        return true
    },

    vincularSocio: async (nroSocio: number) => {
        const { socioSeleccionado: socio_a, socios, sociosFiltrados, sociosVinculados } = get()
        if(!nroSocio || !socio_a || !socio_a.nroSocio) return false

        const socio_b = socios.filter(s => s.nroSocio === nroSocio)[0]
        if(!socio_b) return false

        const ok = await window.electronAPI.vincularSocios(
            socio_b, socio_a,
        )

        if(!ok) return false

        const updatedSocio_a = {
            ...socio_a,
            sociosVinculados: [ ...socio_a.sociosVinculados, nroSocio ],
        }

        const updatedSocio_b = {
            ...socio_b,
            sociosVinculados: [ ...socio_b.sociosVinculados, socio_a.nroSocio ],
        }

        set({
            socioSeleccionado: updatedSocio_a,
            sociosVinculados: [ ...sociosVinculados, socio_b ],
            socios: actualizarSocioEnLista(
                updatedSocio_a,
                actualizarSocioEnLista(updatedSocio_b, socios)
            ),
            sociosFiltrados: actualizarSocioEnLista(
                socio_a,
                actualizarSocioEnLista(updatedSocio_b, sociosFiltrados)
            ),
        })
        return true
    },

    verSocioVinculado: (nroSocio: number) => {
        const { socioSeleccionado, socios, seleccionar } = get()
        if(!socioSeleccionado || !socioSeleccionado.nroSocio || !nroSocio) return

        const socioVinculado = socios.filter(s => Number(s.nroSocio) === Number(nroSocio))
        if(!socioVinculado.length) return;
        seleccionar(socioVinculado[0])
    },

    irAnioAnterior: async () => {
        const { socioSeleccionado, anio } = get()
        if (!socioSeleccionado) return
        const nuevoAnio = anio - 1
        const { meses } = await cargarCuotasSocio(socioSeleccionado.nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, mesesCuotas: meses })
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
        const { maximoDeCuotasAdeudadas, gestionDeCuotas } = useSettingsStore.getState()

        if (!gestionDeCuotas) return

        const caracterSocio = getCaracterSocio(socio.caracterSocio)
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

const actualizarSocioEnLista = (socio: Socio, lista: Socio[]) =>
    lista.map(s => s.nroSocio === socio.nroSocio ? socio : s)