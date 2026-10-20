import type { LibroRegistrado } from "@shared/models"
import { compararTitulos } from "./compararTitulos"

export interface ResultadoOr {
  libro: LibroRegistrado
  enTitulo: number
  enAutor: number
}

// Se busca un libro, el autor ayuda pero no es lo buscado
const grupo = ({ enTitulo }: ResultadoOr) => enTitulo > 0 ? 0 : 1
const total = ({ enTitulo, enAutor }: ResultadoOr) => enTitulo + enAutor

export const ordenarOr = (resultados: ResultadoOr[]): LibroRegistrado[] => [...resultados]
  .sort((a, b) => grupo(a) - grupo(b) || total(b) - total(a) || compararTitulos(a.libro, b.libro))
  .map(({ libro }) => libro)
