import type { LibroRegistrado } from "@shared/models"
import { buscarLibroPorNro } from "../buscarLibroPorNro"
import { contarCoincidencias } from "./coincidencia"
import { esComando, ejecutarComando } from "./comandos"
import { esNumero } from "./esNumero"
import { normalizarLibro, normalizarParaBusqueda, type LibroNormalizado } from "./normalizar"
import { nivelAnd, ordenarOr, ordenarPorNivel, type ResultadoAnd } from "./orden"

export { debeBuscar } from "./debeBuscar"

interface Params {
  libros: LibroRegistrado[]
  dato: string
}

export function buscarLibro({ libros, dato }: Params): LibroRegistrado[] {
  if (esComando(dato)) return ejecutarComando(dato, libros)

  const busqueda = normalizarParaBusqueda(dato)
  if (!busqueda.length) return []

  const porInventario = esNumero(dato) ? buscarLibroPorNro(dato.trim(), libros) : []
  const normalizados = libros.map(normalizarLibro)

  return [...new Set([...porInventario, ...buscarPorPalabras(busqueda, normalizados)])]
}

// Primero todas las palabras (AND), si no hay resultados alcanza con alguna (OR)
function buscarPorPalabras(busqueda: string[], libros: LibroNormalizado[]): LibroRegistrado[] {
  const conTodas = libros
    .map(libro => ({ libro: libro.libro, nivel: nivelAnd(busqueda, libro) }))
    .filter((resultado): resultado is ResultadoAnd => resultado.nivel !== null)

  if (conTodas.length) return ordenarPorNivel(conTodas)

  const conAlgunas = libros
    .map(({ libro, titulo, autor }) => ({
      libro,
      enTitulo: contarCoincidencias(busqueda, titulo),
      enAutor: contarCoincidencias(busqueda, autor),
    }))
    .filter(({ enTitulo, enAutor }) => enTitulo + enAutor > 0)

  return ordenarOr(conAlgunas)
}
