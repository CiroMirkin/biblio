import { levenshtein } from "@/utils"

// Errores de tipeo permitidos segun el largo de lo buscado
const erroresPermitidos = (buscada: string) => {
  if (buscada.length >= 8) return 2
  if (buscada.length >= 5) return 1
  return 0
}

export function coincidePorTolerancia(buscada: string, palabra: string): boolean {
  const errores = erroresPermitidos(buscada)
  if (errores === 0) return false
  if (Math.abs(palabra.length - buscada.length) > errores) return false
  return levenshtein(buscada, palabra) <= errores
}
