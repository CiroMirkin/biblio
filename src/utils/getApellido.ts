
export function getApellido(nombreYApellido: string): string {
  const normalizado = nombreYApellido.toLowerCase().trim()
  const conComa = normalizado.split(",")

  if (conComa.length > 1) {
    return conComa[0].trim()
  }

  return normalizado.split(" ")[0]
}
