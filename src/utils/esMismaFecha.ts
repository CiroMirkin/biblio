
export function esMismaFecha(fecha: Date, otra: Date): boolean {
  return (
    fecha.getFullYear() === otra.getFullYear() &&
    fecha.getMonth() === otra.getMonth() &&
    fecha.getDate() === otra.getDate()
  )
}
