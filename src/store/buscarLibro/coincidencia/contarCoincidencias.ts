import { coincidePalabra, type Coincide } from "./coincidePalabra"

export const contarCoincidencias = (buscadas: string[], palabras: string[], coincide: Coincide = coincidePalabra) =>
  buscadas.filter(buscada => palabras.some(palabra => coincide(buscada, palabra))).length
