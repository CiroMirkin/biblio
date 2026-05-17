
export function calcularDiasDesdePrestamo(fecha: Date): number {
    const hoy = new Date()
    const diff = hoy.getTime() - fecha.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}
