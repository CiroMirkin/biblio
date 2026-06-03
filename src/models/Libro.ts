
export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
    nombreSocio: string
    numeroSocio?: number | null
}

export interface LibroEnPrestamo extends Libro {
    fechaDePrestamo: Date | null
}
