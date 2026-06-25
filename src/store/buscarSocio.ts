import type { Socio } from "@shared/models"
import { getApellido, levenshtein, normailzarTexto } from "@/utils"
import { getRelevanciaDelApellido } from "@/utils/getRelevanciaDelApellido"

interface Params {
    socios: Socio[]
    dato: string
}

export function buscarSocio({ socios, dato }: Params): Socio[] {
    if (!isNaN(Number(dato))) {
        return socios.filter(s => Number(s.nroSocio) === Number(dato))
    }

    const datoNormalizado = normailzarTexto(dato)
    const palabrasDato = datoNormalizado.split(' ').filter(Boolean)

    const filtrados = socios.filter(socio => {
        const apellido = normailzarTexto(getApellido(socio.nombreYApellido))
        const nombreCompleto = normailzarTexto(socio.nombreYApellido.split(',').join(' '))

        if (nombreCompleto.includes(datoNormalizado)) return true
        if (apellido.includes(datoNormalizado)) return true

        return palabrasDato.every(palabraDato =>
            apellido.split(' ').some(palabraApellido => {
                if (palabraApellido.startsWith(palabraDato)) return true
                if (palabraDato.length < 5) return false
                if (Math.abs(palabraApellido.length - palabraDato.length) > 1) return false
                return levenshtein(palabraApellido, palabraDato) <= 1
            }) || nombreCompleto.split(' ').some(palabraNombre => {
                if (palabraNombre.startsWith(palabraDato)) return true
                if (palabraDato.length < 5) return false
                if (Math.abs(palabraNombre.length - palabraDato.length) > 1) return false
                return levenshtein(palabraNombre, palabraDato) <= 1
            })
        )
    })

    const ordenados = filtrados.sort((a, b) =>
        getRelevanciaDelApellido(b.nombreYApellido, dato) - getRelevanciaDelApellido(a.nombreYApellido, dato)
    )

    if (ordenados.length) {
        return ordenados
    }

    return socios.filter(socio =>
        normailzarTexto(socio.nombreYApellido).includes(datoNormalizado)
    )
}