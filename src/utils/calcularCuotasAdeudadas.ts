
type Meses = Record<string, boolean>[]

/** Devuelve la cantidad de cuotas adeudadas contando a partir de la ultima cuota paga,
 *  sin considerar meses posteriores al mes actual. */
export const calcularCuotasAdeudadas = (mesesCuotas: Meses): number => {
    const mesActual = new Date().getMonth()
    const mesesHastaActual = mesesCuotas.slice(0, mesActual + 1)

    const ultimoPago = mesesHastaActual.findLastIndex(mes => Object.values(mes)[0] === true)
    if (ultimoPago === -1) return mesesHastaActual.length

    return mesesHastaActual
        .slice(ultimoPago + 1)
        .filter(mes => Object.values(mes)[0] === false)
        .length
}
