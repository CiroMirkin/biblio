import type { Libro, LibroEnPrestamo } from '../libro'
import { db } from '../libros-db'

/** Registra el prestamo de un libro. */
export async function addLibroPrestado(libro: Libro): Promise<LibroEnPrestamo | null> {
  await db.read()

  const date = new Date()
  const index = db.data.findIndex((l) => l.numeroInventario === libro.numeroInventario)

  if (index !== -1) {
    db.data[index] = {
      ...libro,
      numeroSocio: libro.numeroSocio ?? null,
      fechaDePrestamo: date,
    }
  }
  else {
    db.data.push({
      ...libro,
      numeroSocio: libro.numeroSocio ?? null,
      fechaDePrestamo: date,
    })
  }

  await db.write()

  return {
    ...libro,
    fechaDePrestamo: date,
  }
}