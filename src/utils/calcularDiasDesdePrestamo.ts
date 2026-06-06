
export function calcularDiasDesdePrestamo(fecha: Date): number {
    const hoy = new Date()
    const inicio = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
    const fin = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    return Math.floor((fin - inicio) / (1000 * 60 * 60 * 24))
}
