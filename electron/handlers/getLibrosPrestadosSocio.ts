import type { LibroEnPrestamo } from '../libro'
import { db } from '../libros-db'

export const getLibrosPrestadosSocio = async (nombreSocio: string, nroSocio?: number): Promise<LibroEnPrestamo[]> => {
  await db.read()
  return db.data
    .filter(
      (libro) => libro.numeroSocio === nroSocio || libro.nombreSocio === nombreSocio
    )
    .map(l => ({
      ...l,
      fechaDePrestamo: l.fechaDePrestamo ? new Date(l.fechaDePrestamo) : null,
    }))
}
