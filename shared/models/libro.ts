import type { Marc21EnPrestamo } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

export type Marc21LiteraryForm =
  | "0" // No es ficción
  | "1" // Ficción
  | "c" // Historietas
  | "d" // Dramas
  | "e" // Ensayos
  | "f" // Novelas
  | "h" // Humor, sátiras, etc.
  | "i" // Cartas
  | "j" // Cuentos
  | "m" // Formas mixtas
  | "p" // Poesía
  | "s" // Discursos
  | "u" // Desconocido

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
    literaryForm?: Marc21LiteraryForm
}

export type LibroEnPrestamo = Libro & DatosPrestamo

export type LibroRegistrado = LibroEnPrestamo | Marc21EnPrestamo

/** El sistema solo gestiona menos de 100.000 ejemplares, los números de inventario menores a 100mil son validos. */
export function isValidNumeroInventario(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length <= 5
}