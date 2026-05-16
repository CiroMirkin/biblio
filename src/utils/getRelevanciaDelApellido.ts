import { getApellido } from "./getApellido"
import { levenshtein } from "./levenshtein"

/**
 * Devuelve un puntaje de relevancia para ordenar resultados de búsqueda.
 - 1000: match exacto.
 - 1..N: cantidad de caracteres en común con la query desde el inicio (ej: "ber" vs "berardi" = 3).
 - 0: ninguna palabra empieza con la query pero hay similitud por levenshtein.
 - -1: sin coincidencia.
 */
export function getRelevanciaDelApellido(nombreYApellido: string, query: string): number {
    const apellido = getApellido(nombreYApellido)

    if (apellido === query) return 1000

    const mejorPrefijo = apellido.split(' ').reduce((max, palabra) => {
        let i = 0
        while (i < query.length && i < palabra.length && palabra[i] === query[i]) i++
        return Math.max(max, i)
    }, 0)

    if (mejorPrefijo > 0) return mejorPrefijo

    const esLevenshtein = apellido.split(' ').some(palabra => {
        if (Math.abs(palabra.length - query.length) > 1) return false
        return levenshtein(palabra, query) <= 1
    })

    return esLevenshtein ? 0 : -1
}
