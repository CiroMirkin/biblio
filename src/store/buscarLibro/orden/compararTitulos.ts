import type { LibroRegistrado } from "@shared/models"

export const compararTitulos = (a: LibroRegistrado, b: LibroRegistrado) =>
  (a.titulo ?? "").localeCompare(b.titulo ?? "", "es", { sensitivity: "base" })
