import type { Marc21EnPrestamo } from "./Marc21"

export interface DatosPrestamo {
    nombreSocio?: string
    numeroSocio?: number | null
    fechaDePrestamo: Date | null
}

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
}

export type LibroEnPrestamo = Libro & DatosPrestamo

export type LibroRegistrado = LibroEnPrestamo | Marc21EnPrestamo