import { coincidePorPrefijo } from "./coincidePorPrefijo"
import { coincidePorTolerancia } from "./coincidePorTolerancia"

export type Coincide = (buscada: string, palabra: string) => boolean

export const coincidePalabra: Coincide = (buscada, palabra) =>
  coincidePorPrefijo(buscada, palabra) || coincidePorTolerancia(buscada, palabra)
