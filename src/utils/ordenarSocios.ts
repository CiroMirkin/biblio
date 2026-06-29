import type { Socio } from "@shared/models"

export function ordenarSociosAlfabeticamente(socios: Socio[]): Socio[] {
  return [...socios].sort((a, b) =>
    a.nombreYApellido.localeCompare(b.nombreYApellido, 'es', { sensitivity: 'base' })
  )
}
