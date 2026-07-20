import type { LibroRegistrado } from "@shared/models";
import { esMismaFecha } from "./esMismaFecha";

export function buscarLibrosRegistradosHoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDeIngreso != null && esMismaFecha(libro.fechaDeIngreso, hoy)
  )
}
