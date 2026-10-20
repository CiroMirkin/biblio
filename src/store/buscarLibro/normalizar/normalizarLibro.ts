import type { LibroRegistrado } from "@shared/models"
import { limpiarTexto } from "./limpiarTexto"
import { quitarPalabrasIgnoradas } from "./quitarPalabrasIgnoradas"
import { tokenizar } from "./tokenizar"

export interface LibroNormalizado {
  libro: LibroRegistrado
  // todas las palabras, para buscar tambien por palabras ignoradas
  titulo: string[]
  tituloSignificativo: string[]
  autor: string[]
}

export function normalizarLibro(libro: LibroRegistrado): LibroNormalizado {
  const titulo = tokenizar(limpiarTexto(libro.titulo ?? ""))

  return {
    libro,
    titulo,
    tituloSignificativo: quitarPalabrasIgnoradas(titulo),
    autor: tokenizar(limpiarTexto(libro.autor ?? "")),
  }
}
