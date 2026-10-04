import { create } from "zustand"
import type { CaracterSocio } from "@/models/Socio"
import type { NewSocio, Socio } from "@shared/models"
import { cargarSocios } from "@/services/cargarSocios"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"

interface SociosState {
    socios: Socio[]
    query: string
    loadingSocios: boolean

    inicializar: () => Promise<void>
    buscar: (query: string) => void

    crearSocio: (socioData: NewSocio) => Promise<Socio | null>
    editarDatos: (nroSocio: number, datos: Partial<Socio>) => Promise<void>
    cambiarNombre: (nroSocio: number, newName: string) => Promise<void>
    setObservaciones: (nroSocio: number, newObservaciones: string) => Promise<void>

    darDeBaja: (nroSocio: number) => Promise<void>
    reactivar: (nroSocio: number) => Promise<void>

    vincularSocio: (nroSocio: number, nroAVincular: number) => Promise<boolean>
    desvincularSocio: (nroSocio: number, nroADesvincular: number) => Promise<boolean>
}

export const useSociosStore = create<SociosState>((set, get) => {
    const getSocio = (nroSocio: number) => get().socios.find(s => s.nroSocio === nroSocio)

    const reemplazar = (...actualizados: Socio[]) => set({
        socios: actualizados.reduce((lista, s) => actualizarSocioEnLista(s, lista), get().socios),
    })

    return {
        socios: [],
        query: "",
        loadingSocios: true,

        inicializar: async () => {
            const socios = await cargarSocios()
            set({
                socios: ordenarSociosAlfabeticamente(socios),
                loadingSocios: false,
            })
        },

        buscar: (query) => set({ query }),

        editarDatos: async (nroSocio, datos) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.editarDatosSocio(nroSocio, datos)
            if (!ok) return

            reemplazar({ ...socio, ...datos })
        },

        darDeBaja: async (nroSocio) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.darDeBajaSocio(nroSocio)
            if (!ok) return

            const caracterSocio: CaracterSocio = 'Inactivo'
            reemplazar({ ...socio, caracterSocio })
        },

        reactivar: async (nroSocio) => {
            const socio = getSocio(nroSocio)
            if (!socio) return

            const ok = await window.electronAPI.reactivarSocio(nroSocio)
            if (!ok) return

            const caracterSocio: CaracterSocio = 'Regular'
            reemplazar({ ...socio, caracterSocio })
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

        crearSocio: async (socioData) => {
            const nuevoSocio = await window.electronAPI.createSocio(socioData)
            if (!nuevoSocio) return null

            set({ socios: ordenarSociosAlfabeticamente([...get().socios, nuevoSocio]) })
            return nuevoSocio
        },
    }
})

const actualizarSocioEnLista = (socio: Socio, lista: Socio[]) =>
    lista.map(s => s.nroSocio === socio.nroSocio ? socio : s)
