
export function calcularDiasDesdePrestamo(fecha: Date | undefined): number {
    if(!fecha) return 0

    let inicio = new Date(fecha)

    if (inicio.getFullYear() < 100) {
        inicio.setFullYear(2000 + inicio.getFullYear())
    }
    else if (inicio.getFullYear() === 1926) {
        // JS puede asumir que "26" es 1926
        inicio.setFullYear(2026)
    }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    inicio.setHours(0, 0, 0, 0)
    const diferenciaMilisegundos = hoy.getTime() - inicio.getTime()
    return Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24))
}
