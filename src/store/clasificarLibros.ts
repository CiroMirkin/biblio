import type { LibroRegistrado } from "@shared/models"
import { calcularDiasDesdePrestamo } from "@/utils"
import { buscarLibro } from "./buscarLibro"
import { filtrarLibrosVencidos } from "./filtrarLibrosVencidos"

export interface LibrosClasificados {
  disponibles: LibroRegistrado[]
  prestados: LibroRegistrado[]
  vencidos: LibroRegistrado[]
  // sin busqueda son los vencidos
  filtrados: LibroRegistrado[]
}

export function clasificarLibros(libros: LibroRegistrado[], limiteDeDias: number, query = ""): LibrosClasificados {
  const disponibles = libros.filter(l => l.fechaDePrestamo == null)

  const prestados = libros.filter(l =>
    l.fechaDePrestamo != null && calcularDiasDesdePrestamo(l.fechaDePrestamo) <= limiteDeDias
  )

  const vencidos = filtrarLibrosVencidos({ libros, limiteDeDias }).reverse()

  const dato = query.toLowerCase().trim()
  const filtrados = dato
    ? buscarLibro({ libros, dato }) || []
    : vencidos

  return { disponibles, prestados, vencidos, filtrados, }
}
