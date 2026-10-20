import type { LibroRegistrado } from "@shared/models"
import { compararTitulos } from "./compararTitulos"
import type { Nivel } from "./nivelAnd"

export interface ResultadoAnd {
  libro: LibroRegistrado
  nivel: Nivel
}

export const ordenarPorNivel = (resultados: ResultadoAnd[]): LibroRegistrado[] => [...resultados]
  .sort((a, b) => a.nivel - b.nivel || compararTitulos(a.libro, b.libro))
  .map(({ libro }) => libro)
