import { cargarCuotasSocio } from "@/services"

const calcularMesesDesdeUltimoPago = async (
    nroSocio: number,
    anioUltimoPago: number,
    mesUltimoPago: number
): Promise<number> => {
    const anioActual = new Date().getFullYear()
    const mesActual = new Date().getMonth()

    let total = 0
    for (let anio = anioUltimoPago; anio <= anioActual; anio++) {
        const { meses } = await cargarCuotasSocio(nroSocio, anio)

        const desde = anio === anioUltimoPago ? mesUltimoPago + 1 : 0
        const hasta = anio === anioActual ? mesActual + 1 : 12

        total += meses
            .slice(desde, hasta)
            .filter(mes => Object.values(mes)[0] === false)
            .length
    }

    return total
}

/** Devuelve la cantidad de cuotas adeudadas contando a partir de la ultima cuota paga,
 *  sin considerar meses posteriores al mes actual. */
export const calcularCuotasAdeudadas = async (nroSocio: number): Promise<number> => {
    const { meses: mesesCuotas, anio } = await cargarCuotasSocio(nroSocio)

    const mesActual = new Date().getMonth()
    const anioActual = new Date().getFullYear()
    const mesesHastaActual = anio === anioActual
        ? mesesCuotas.slice(0, mesActual + 1)
        : mesesCuotas

    const ultimoPago = mesesHastaActual.findLastIndex(mes => Object.values(mes)[0] === true)

    if (anio !== anioActual) {
        const mesUltimoPago = ultimoPago === -1 ? -1 : ultimoPago
        const anioDesde = ultimoPago === -1 ? anio : anio
        return calcularMesesDesdeUltimoPago(nroSocio, anioDesde, mesUltimoPago)
    }

    if (ultimoPago === -1) return mesesHastaActual.length

    return mesesHastaActual
        .slice(ultimoPago + 1)
        .filter(mes => Object.values(mes)[0] === false)
        .length
}
