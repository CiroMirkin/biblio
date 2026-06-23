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
        const nombreCompleto = normailzarTexto(socio.nombreYApellido).replace(/[,()]/g, ' ')

        if (nombreCompleto.includes(datoNormalizado)) return true
        if (apellido.includes(datoNormalizado)) return true

        const palabrasSocio = nombreCompleto.split(' ').filter(Boolean)

        return palabrasDato.some(palabraDato =>
            palabrasSocio.some(palabraS => {
                const sonSimilaresPorInicio = palabraS.startsWith(palabraDato) || palabraDato.startsWith(palabraS)
                const sonSimilaresPorFin = palabraS.endsWith(palabraDato) || palabraDato.endsWith(palabraS)
                if (sonSimilaresPorInicio || sonSimilaresPorFin) return true
                
                if (palabraS.length >= 7 && palabraDato.length >= 7) {
                    if (palabraS.includes(palabraDato.substring(1)) || 
                        palabraS.includes(palabraDato.substring(0, palabraDato.length - 1)) ||
                        palabraDato.includes(palabraS.substring(1)) ||
                        palabraDato.includes(palabraS.substring(0, palabraS.length - 1))) {
                        return true
                    }
                }

                const esPalabraLarga = palabraDato.length >= 7 || palabraS.length >= 7
                const maxDiferenciaPermitida = esPalabraLarga ? 2 : 1
                const longitudInvalida = Math.abs(palabraS.length - palabraDato.length) > maxDiferenciaPermitida
                const esPalabraCorta = palabraDato.length < 3 && palabraS.length < 3

                if (esPalabraCorta || longitudInvalida) return false
                
                return levenshtein(palabraS, palabraDato) <= 2 || levenshtein(palabraDato, palabraS) <= 2
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
        
        const coincidenciasPalabrasA = palabrasDato.filter(p => palabrasA.includes(p)).length
        const coincidenciasPalabrasB = palabrasDato.filter(p => palabrasB.includes(p)).length
        if (coincidenciasPalabrasA !== coincidenciasPalabrasB) {
            return coincidenciasPalabrasB - coincidenciasPalabrasA
        }

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