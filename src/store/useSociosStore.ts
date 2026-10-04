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
import { useLibrosStore } from "./useLibrosStore"

interface SociosState {
    socios: Socio[]
    sociosConLibros: Socio[]
    sociosFiltrados: Socio[]
    mesesCuotas: Calendario
    anio: number
    sociosActivos: number
    sociosInactivos: number
    loadingSocios: boolean

    inicializar: () => Promise<void>
    buscar: (apellido: string) => void
    prepararSocio: (nroSocio: number) => Promise<void>
    toggleMes: (nroSocio: number, mesIndex: number) => Promise<void>
    irAnioAnterior: (nroSocio: number) => Promise<void>
    irAnioSiguiente: (nroSocio: number) => Promise<void>

    crearSocio: (socioData: NewSocio) => Promise<Socio | null>
    editarDatos: (nroSocio: number, datos: Partial<Socio>) => Promise<void>
    cambiarNombre: (nroSocio: number, newName: string) => Promise<void>
    setObservaciones: (nroSocio: number, newObservaciones: string) => Promise<void>

    darDeBaja: (nroSocio: number) => Promise<void>
    reactivar: (nroSocio: number) => Promise<void>
    aplicarCambioAutomaticoDeCaracter: (socio: Socio) => Promise<void>

    vincularSocio: (nroSocio: number, nroAVincular: number) => Promise<boolean>
    desvincularSocio: (nroSocio: number, nroADesvincular: number) => Promise<boolean>
}

export const useSociosStore = create<SociosState>((set, get) => {
    const getSocio = (nroSocio: number) => get().socios.find(s => s.nroSocio === nroSocio)

    const reemplazar = (...actualizados: Socio[]) => {
        const { socios, sociosFiltrados } = get()
        set({
            socios: actualizados.reduce((lista, s) => actualizarSocioEnLista(s, lista), socios),
            sociosFiltrados: actualizados.reduce((lista, s) => actualizarSocioEnLista(s, lista), sociosFiltrados),
        })
    }

    return {
        socios: [],
        sociosConLibros: [],
        sociosFiltrados: [],
        mesesCuotas: [],
        anio: new Date().getFullYear(),
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

        buscar: (apellido) => {
            const { socios, sociosConLibros } = get()

            const query = apellido.toLowerCase().trim()
            if (!query) {
                set({ sociosFiltrados: [...sociosConLibros] })
                return
            }

            const filtrados = buscarSocio({ dato: query, socios, libros: useLibrosStore.getState().libros })
            set({ sociosFiltrados: filtrados })
        },

        prepararSocio: async (nroSocio) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const { anio, meses: mesesCuotas } = await cargarCuotasSocio(nroSocio)
            await get().aplicarCambioAutomaticoDeCaracter(socio)
            set({ mesesCuotas, anio })
        },

        editarDatos: async (nroSocio, datos) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.editarDatosSocio(nroSocio, datos)
            if (!ok) return

            reemplazar({ ...socio, ...datos })
        },

        toggleMes: async (nroSocio, mesIndex) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            // PARA MIGRACION: permite que luego de actualizar las cuotas el caracter se defina automaticamente
            if(getCaracterSocio(socio.caracterSocio).tieneCuotasDesactualizadas) {
                await get().reactivar(nroSocio)
            }

            const pagado = await window.electronAPI.toggleCuota(nroSocio, get().anio, mesIndex)

            const next = [...get().mesesCuotas]
            const key = Object.keys(next[mesIndex])[0]
            next[mesIndex] = { [key]: pagado }
            set({ mesesCuotas: next })
        },

        darDeBaja: async (nroSocio) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.darDeBajaSocio(nroSocio)
            if (!ok) return

            const caracterSocio: CaracterSocio = 'Inactivo'
            reemplazar({ ...socio, caracterSocio })
            const { sociosActivos, sociosInactivos } = get()
            set({ sociosInactivos: sociosInactivos + 1, sociosActivos: sociosActivos - 1 })
        },

        reactivar: async (nroSocio) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.reactivarSocio(nroSocio)
            if (!ok) return

            const caracterSocio: CaracterSocio = 'Regular'
            reemplazar({ ...socio, caracterSocio })
            const { sociosActivos, sociosInactivos } = get()
            set({ sociosActivos: sociosActivos + 1, sociosInactivos: sociosInactivos - 1 })
        },

        setObservaciones: async (nroSocio, newObservaciones) => get().editarDatos(nroSocio, { observaciones: newObservaciones }),

        cambiarNombre: async (nroSocio, newName) => {
            const socio = getSocio(nroSocio)
            if(!socio || !newName.trim()) return

            const ok = await window.electronAPI.cambiarNombreSocio(nroSocio, newName)
            if(!ok) return

            reemplazar({ ...socio, nombreYApellido: newName })
        },

        desvincularSocio: async (nroSocio, nroADesvincular) => {
            const socio_a = getSocio(nroSocio)
            const socio_b = getSocio(nroADesvincular)
            if(!socio_a || !socio_b) return false

            const ok = await window.electronAPI.desvincularSocios(socio_b, socio_a)
            if(!ok) return false

            reemplazar(
                { ...socio_a, sociosVinculados: socio_a.sociosVinculados.filter(nro => nro !== nroADesvincular) },
                { ...socio_b, sociosVinculados: socio_b.sociosVinculados.filter(nro => nro !== nroSocio) },
            )
            return true
        },

        vincularSocio: async (nroSocio, nroAVincular) => {
            const socio_a = getSocio(nroSocio)
            const socio_b = getSocio(nroAVincular)
            if(!socio_a || !socio_b) return false

            const ok = await window.electronAPI.vincularSocios(socio_b, socio_a)
            if(!ok) return false

            reemplazar(
                { ...socio_a, sociosVinculados: [ ...socio_a.sociosVinculados, nroAVincular ] },
                { ...socio_b, sociosVinculados: [ ...socio_b.sociosVinculados, nroSocio ] },
            )
            return true
        },

        irAnioAnterior: async (nroSocio) => {
            const nuevoAnio = get().anio - 1
            const { meses } = await cargarCuotasSocio(nroSocio, nuevoAnio)
            set({ anio: nuevoAnio, mesesCuotas: meses })
        },

        irAnioSiguiente: async (nroSocio) => {
            const nuevoAnio = get().anio + 1
            const { meses } = await cargarCuotasSocio(nroSocio, nuevoAnio)
            set({ anio: nuevoAnio, mesesCuotas: meses })
        },

        crearSocio: async (socioData) => {
            const nuevoSocio = await window.electronAPI.createSocio(socioData)
            if (!nuevoSocio) return null

            const { socios, sociosFiltrados } = get()
            set({
                socios: ordenarSociosAlfabeticamente([...socios, nuevoSocio]),
                sociosFiltrados: ordenarSociosAlfabeticamente([...sociosFiltrados, nuevoSocio]),
            })
            return nuevoSocio
        },

        aplicarCambioAutomaticoDeCaracter: async (socio: Socio) => {
            const { maximoDeCuotasAdeudadas, gestionDeCuotas } = useSettingsStore.getState()

            if (!gestionDeCuotas) return

            const caracterSocio = getCaracterSocio(socio.caracterSocio)
            if (caracterSocio.tieneCuotasDesactualizadas) return

            const cuotasAdeudadas = await calcularCuotasAdeudadas(socio.nroSocio, socio.fechaIngreso)
            if (caracterSocio.caracter) {
                if (cuotasAdeudadas > maximoDeCuotasAdeudadas) {
                    await get().darDeBaja(socio.nroSocio)
                }
            }
        },
    }
})

const actualizarSocioEnLista = (socio: Socio, lista: Socio[]) =>
    lista.map(s => s.nroSocio === socio.nroSocio ? socio : s)
