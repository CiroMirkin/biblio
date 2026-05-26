
/** @returns DD/MM/AA */
export const formatFecha = (fecha: Date | null): string => {
    if (fecha === null) return ""

    return fecha.toLocaleDateString(
        'es-AR', 
        { day: '2-digit', month: '2-digit', year: '2-digit' },
    )
}
