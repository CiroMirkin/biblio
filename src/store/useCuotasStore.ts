import { create } from "zustand"
import { getCaracterSocio, type Calendario } from "@/models"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { useSettingsStore } from "./useSettingsStore"
import { useSociosStore } from "./useSociosStore"

interface CuotasState {
    nroSocio: number | null
    anio: number
    meses: Calendario

    abrir: (nroSocio: number) => Promise<void>
    toggleMes: (mesIndex: number) => Promise<void>
    irAnioAnterior: () => Promise<void>
    irAnioSiguiente: () => Promise<void>
}

export const useCuotasStore = create<CuotasState>((set, get) => {
    const irAnio = async (nuevoAnio: number) => {
        const { nroSocio } = get()
        if (nroSocio === null) return

        const { meses } = await cargarCuotasSocio(nroSocio, nuevoAnio)
        set({ anio: nuevoAnio, meses })
    }

    return {
        nroSocio: null,
        anio: new Date().getFullYear(),
        meses: [],

        abrir: async (nroSocio) => {
            if (!useSettingsStore.getState().gestionDeCuotas) {
                set({ nroSocio, anio: new Date().getFullYear(), meses: [] })
                return
            }

            const cuotas = await cargarCuotasSocio(nroSocio)
            await aplicarCambioAutomaticoDeCaracter(nroSocio, cuotas)
            set({
                nroSocio,
                anio: cuotas.anio,
                meses: cuotas.meses,
            })
        },

        toggleMes: async (mesIndex) => {
            const { nroSocio, anio } = get()
            const socio = useSociosStore.getState().socios.find(s => s.nroSocio === nroSocio)
            if (!socio) return

            // MIGRACION: permite que luego de actualizar las cuotas el caracter se defina automaticamente
            if (getCaracterSocio(socio.caracterSocio).tieneCuotasDesactualizadas) {
                await useSociosStore.getState().reactivar(socio.nroSocio)
            }

            const pagado = await window.electronAPI.toggleCuota(socio.nroSocio, anio, mesIndex)

            const meses = [...get().meses]
            const key = Object.keys(meses[mesIndex])[0]
            meses[mesIndex] = { [key]: pagado }
            set({ meses })
        },

        irAnioAnterior: () => irAnio(get().anio - 1),
        irAnioSiguiente: () => irAnio(get().anio + 1),
    }
})

const aplicarCambioAutomaticoDeCaracter = async (nroSocio: number, cuotas: { anio: number, meses: Calendario }) => {
    const socio = useSociosStore.getState().socios.find(s => s.nroSocio === nroSocio)
    if (!socio) return

    const caracterSocio = getCaracterSocio(socio.caracterSocio)
    if (caracterSocio.tieneCuotasDesactualizadas) return

    const { maximoDeCuotasAdeudadas } = useSettingsStore.getState()
    const cuotasAdeudadas = await calcularCuotasAdeudadas(nroSocio, socio.fechaIngreso, cuotas)
    if (cuotasAdeudadas > maximoDeCuotasAdeudadas) {
        await useSociosStore.getState().darDeBaja(nroSocio)
    }
}

const estaPago = (mes: Calendario[number]) => Object.values(mes)[0] === true

const contarImpagos = (meses: Calendario, desde: number, hasta: number) =>
    meses.slice(desde, hasta).filter(mes => Object.values(mes)[0] === false).length

/** Cuenta las cuotas adeudadas desde la ultima cuota paga sin considerar meses posteriores al actual.
 *  Parte del año ya cargado y solo pide los años siguientes cuando ese año no es el actual. */
const calcularCuotasAdeudadas = async (
    nroSocio: number,
    fechaIngreso: String | null | undefined,
    { anio, meses }: { anio: number, meses: Calendario },
): Promise<number> => {
    const anioActual = new Date().getFullYear()
    const mesActual = new Date().getMonth()
    const hasta = (a: number) => a === anioActual ? mesActual + 1 : 12

    const ultimoPago = meses.slice(0, hasta(anio)).findLastIndex(estaPago)

    if (anio === anioActual && ultimoPago === -1) {
        return hasta(anio) - mesesAntesDeIngreso(fechaIngreso, anioActual)
    }

    let total = contarImpagos(meses, ultimoPago + 1, hasta(anio))
    for (let a = anio + 1; a <= anioActual; a++) {
        const { meses } = await cargarCuotasSocio(nroSocio, a)
        total += contarImpagos(meses, 0, hasta(a))
    }
    return total
}

// fechaIngreso viene como D/M/AA o D/M/AAAA, si no se puede leer se cuenta desde enero
const mesesAntesDeIngreso = (fechaIngreso: String | null | undefined, anioActual: number): number => {
    const [, mes, anio] = String(fechaIngreso ?? '').split('/').map(Number)
    if (!mes || !anio) return 0
    const anioCompleto = anio < 100 ? 2000 + anio : anio
    return anioCompleto === anioActual ? mes - 1 : 0
}
