import type { Marc21EnPrestamo } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
}

export type LibroEnPrestamo = Libro & DatosPrestamo

export type LibroRegistrado = LibroEnPrestamo | Marc21EnPrestamo
