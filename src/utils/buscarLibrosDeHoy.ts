import { esMismaFecha } from "@/utils";
import type { LibroRegistrado } from "@shared/models";

export function buscarLibrosDeHoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDePrestamo != null && esMismaFecha(libro.fechaDePrestamo, hoy)
  )
}
