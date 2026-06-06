import type { Socio } from "@/models"
import { getApellido, levenshtein } from "@/utils"
import { getRelevanciaDelApellido } from "@/utils/getRelevanciaDelApellido"

interface Params {
    socios: Socio[]
    dato: string
}

export function buscarSocio({ socios, dato }: Params): Socio[] {
    const filtrados = socios.filter(socio => {
        const apellido = getApellido(socio.nombreYApellido)
        if (apellido.includes(dato)) return true
        return apellido.split(' ').some(palabra => {
            if (palabra.startsWith(dato)) return true
            if (dato.length < 5) return false
            if (Math.abs(palabra.length - dato.length) > 1) return false
            return levenshtein(palabra, dato) <= 1
        })
    })

    const ordenados = filtrados.sort((a, b) => {
        return getRelevanciaDelApellido(b.nombreYApellido, dato) - getRelevanciaDelApellido(a.nombreYApellido, dato)
    })

    return ordenados
}