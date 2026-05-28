import type { LibroEnPrestamo } from '../libro'
import { db } from '../libros-db'

export const getLibrosPrestadosSocio = async (nombreSocio: string, nroSocio?: number): Promise<LibroEnPrestamo[]> => {
  await db.read()
  return db.data.filter(
    (libro) => libro.numeroSocio === nroSocio || libro.nombreSocio === nombreSocio
  )
}
