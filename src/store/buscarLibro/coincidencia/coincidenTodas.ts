import { coincidePalabra, type Coincide } from "./coincidePalabra"

export const coincidenTodas = (buscadas: string[], palabras: string[], coincide: Coincide = coincidePalabra) =>
  buscadas.every(buscada => palabras.some(palabra => coincide(buscada, palabra)))
