import { CAMPOS_INSCRIPCION, useCamposInscripcionStore } from "@/store"

function formatLista(items: string[]) {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`
}

export function DatosNecesariosTexto() {
  const { camposRequeridos } = useCamposInscripcionStore()

  const requeridos = CAMPOS_INSCRIPCION.filter(({ key }) => camposRequeridos[key]).map(({ label }) => label)
  const datos = ["el apellido", "el nombre", ...requeridos.map((label) => `el ${label}`)]

  return <p>{formatLista(datos)} son los únicos datos 100% necesarios.</p>
}
