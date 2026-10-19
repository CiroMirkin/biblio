import { quitarSignos } from "./quitarSignos"
import { quitarTildes } from "./quitarTildes"

export const limpiarTexto = (texto: string) => quitarSignos(quitarTildes(texto.toLowerCase()))
  .replace(/\s+/g, " ")
  .trim()
