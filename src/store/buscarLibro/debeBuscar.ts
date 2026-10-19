import { esComando } from "./comandos"
import { esNumero } from "./esNumero"
import { esPalabraIgnorada, limpiarTexto, tokenizar } from "./normalizar"

// La busqueda es automatica, con menos letras genera ruido mientras se escribe
const MINIMO_CARACTERES = 3

export function debeBuscar(dato: string): boolean {
  if (esComando(dato) || esNumero(dato)) return true

  const texto = limpiarTexto(dato)
  const soloIgnoradas = tokenizar(texto).every(esPalabraIgnorada)

  return soloIgnoradas
    ? texto.length > MINIMO_CARACTERES
    : texto.length >= MINIMO_CARACTERES
}
