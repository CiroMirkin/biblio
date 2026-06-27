
/** 1000 -> "1.000" */
export const formatNro = (nro: number | string | undefined): string => {
    if(!nro) return ""
    return `${Number(nro).toLocaleString("es-PY")}`
}
