import type { Marc21LiteraryForm } from "./literaryForm"
import type { Marc21EnPrestamo } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

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