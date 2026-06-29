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

export function isValidNumeroInventario(value: string | number): boolean {
  const str = String(value).trim()
  if (!str) return false

  const digits = str.replace(/\D/g, '')
  if (!digits || Number(digits) === 0) return false
  
  return digits.length <= 5
}