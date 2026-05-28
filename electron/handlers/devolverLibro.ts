import { db } from '../libros-db'

export async function devolverLibro(numeroInventario: number): Promise<boolean> {
  await db.read()

  const libro = db.data.find((l) => l.numeroInventario === numeroInventario)
  if (!libro) return false

  libro.nombreSocio = ''
  libro.numeroSocio = null
  libro.fechaDePrestamo = null

  await db.write()
  return true
}
