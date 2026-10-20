import { coincidePorPrefijo, coincidenTodas } from "../coincidencia"
import type { LibroNormalizado } from "../normalizar"

// Menor nivel, mas arriba en los resultados
export const NIVEL = {
  INVENTARIO: 1,
  TITULO_EXACTO: 2,
  TITULO_EMPIEZA: 3,
  TODO_EN_TITULO: 4,
  TITULO_Y_AUTOR: 5,
  TODO_EN_AUTOR: 6,
  TOLERANCIA: 7,
} as const

export type Nivel = typeof NIVEL[keyof typeof NIVEL]

export function nivelAnd(busqueda: string[], { titulo, tituloSignificativo, autor }: LibroNormalizado): Nivel | null {
  const frase = busqueda.join(" ")
  const fraseTitulo = tituloSignificativo.join(" ")

  if (fraseTitulo === frase) return NIVEL.TITULO_EXACTO
  if (fraseTitulo.startsWith(frase)) return NIVEL.TITULO_EMPIEZA
  if (coincidenTodas(busqueda, titulo, coincidePorPrefijo)) return NIVEL.TODO_EN_TITULO
  if (coincidenTodas(busqueda, autor, coincidePorPrefijo)) return NIVEL.TODO_EN_AUTOR
  if (coincidenTodas(busqueda, [...titulo, ...autor], coincidePorPrefijo)) return NIVEL.TITULO_Y_AUTOR
  if (coincidenTodas(busqueda, [...titulo, ...autor])) return NIVEL.TOLERANCIA
  return null
}
