import { useMemo } from "react"
import { useLibrosStore } from "./useLibrosStore"
import { useSettingsStore } from "./useSettingsStore"
import { clasificarLibros, type LibrosClasificados } from "./clasificarLibros"

export const useLibrosClasificados = (): LibrosClasificados => {
  const libros = useLibrosStore(s => s.libros)
  const query = useLibrosStore(s => s.query)
  const limiteDeDias = useSettingsStore(s => s.limiteDeDias)
  return useMemo(() => (
    clasificarLibros(libros, limiteDeDias, query)
  ), [libros, limiteDeDias, query])
}
