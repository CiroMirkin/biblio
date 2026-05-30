
type Meses = Record<string, boolean>[]

/** Devuelve la cantidad de cuotas adeudadas contando a partir de la ultima cuota paga. */
export const calcularCuotasAdeudadas = (mesesCuotas: Meses): number => {
    const ultimoPago = mesesCuotas.findLastIndex(mes => Object.values(mes)[0] === true)
    if (ultimoPago === -1) return mesesCuotas.length

    return mesesCuotas
        .slice(ultimoPago + 1)
        .filter(mes => Object.values(mes)[0] === false)
        .length
}
