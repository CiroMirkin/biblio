import type { LibroRegistrado } from "@shared/models";
import { esMismaFecha } from "@shared/utils";

export function buscarLibrosDeHoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDePrestamo != null && esMismaFecha(libro.fechaDePrestamo, hoy)
  )
}
