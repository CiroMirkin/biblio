import { format } from "@formkit/tempo"

export const getDia = (fecha: Date | null): string => {
    if(!fecha) return ''

    const inicio = fecha
    return format(inicio, 'full','es').split(',')[0]
}