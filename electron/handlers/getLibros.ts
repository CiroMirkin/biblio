import type { LibroEnPrestamo } from '../libro'
import { db } from '../libros-db'

export const getLibros = async (): Promise<LibroEnPrestamo[]> => {
    await db.read()
    return db.data.map(l => ({
      ...l,
      fechaDePrestamo: l.fechaDePrestamo ? new Date(l.fechaDePrestamo) : null,
    }))
}
