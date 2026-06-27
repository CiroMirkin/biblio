import type { Marc21EnPrestamo } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
}

export type LibroEnPrestamo = Libro & DatosPrestamo

export type LibroRegistrado = LibroEnPrestamo | Marc21EnPrestamo

/** El sistema solo gestiona menos de 100.000 ejemplares, los números de inventario menores a 100mil son validos. */
export function isValidNumeroInventario(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length <= 5
}