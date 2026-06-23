import type { Socio } from "@/models"
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
                const sonSimilaresPorInicio = palabraApellido.startsWith(palabraDato) || palabraDato.startsWith(palabraApellido)
                if (sonSimilaresPorInicio) return true
                
                const esPalabraLarga = palabraDato.length >= 7 || palabraApellido.length >= 7
                const maxDiferenciaPermitida = esPalabraLarga ? 2 : 1
                const longitudInvalida = Math.abs(
                    palabraApellido.length - palabraDato.length
                ) > maxDiferenciaPermitida
                const esPalabraCorta = palabraDato.length < 4 && palabraApellido.length < 4

                if (esPalabraCorta || longitudInvalida) return false
                
                return levenshtein(palabraApellido, palabraDato) <= 2
            }) || nombreCompleto.split(' ').some(palabraNombre => {
                const sonSimilaresPorInicio = palabraNombre.startsWith(palabraDato) || palabraDato.startsWith(palabraNombre)
                const sonSimilaresPorFin = palabraNombre.endsWith(palabraDato)
                if (sonSimilaresPorInicio || sonSimilaresPorFin) return true
                
                const esPalabraLarga = palabraDato.length >= 7 || palabraNombre.length >= 7
                const maxDiferenciaPermitida = esPalabraLarga ? 2 : 1
                const longitudInvalida = Math.abs(palabraNombre.length - palabraDato.length) > maxDiferenciaPermitida
                const esPalabraCorta = palabraDato.length < 4 && palabraNombre.length < 4
                if (esPalabraCorta || longitudInvalida) return false
                
                return levenshtein(palabraNombre, palabraDato) <= 2
            })
        )
    })

    const ordenados = filtrados.sort((a, b) => {
        const nameA = normailzarTexto(a.nombreYApellido)
        const nameB = normailzarTexto(b.nombreYApellido)

        // Coincidencia exacta de la frase entera
        const exactoA = nameA.includes(datoNormalizado) ? 1 : 0
        const exactoB = nameB.includes(datoNormalizado) ? 1 : 0
        if (exactoA !== exactoB) return exactoB - exactoA

        // Coincidencia de palabras exactas sueltas
        const palabrasA = nameA.split(/[\s,]+/).filter(Boolean)
        const palabrasB = nameB.split(/[\s,]+/).filter(Boolean)
        
        const tienePalabraExactaA = palabrasDato.some(p => palabrasA.includes(p)) ? 1 : 0
        const tienePalabraExactaB = palabrasDato.some(p => palabrasB.includes(p)) ? 1 : 0
        if (tienePalabraExactaA !== tienePalabraExactaB) return tienePalabraExactaB - tienePalabraExactaA

        // Relevancia por defecto (Levenshtein/Aproximación)
        return getRelevanciaDelApellido(b.nombreYApellido, dato) - getRelevanciaDelApellido(a.nombreYApellido, dato)
    })

    if (ordenados.length) {
        return ordenados
    }

    return socios.filter(socio =>
        normailzarTexto(socio.nombreYApellido).includes(datoNormalizado)
    )
}