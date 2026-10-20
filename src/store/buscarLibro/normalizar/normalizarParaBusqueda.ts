import { limpiarTexto } from "./limpiarTexto"
import { quitarPalabrasIgnoradas } from "./quitarPalabrasIgnoradas"
import { tokenizar } from "./tokenizar"

export const normalizarParaBusqueda = (texto: string) => quitarPalabrasIgnoradas(tokenizar(limpiarTexto(texto)))
