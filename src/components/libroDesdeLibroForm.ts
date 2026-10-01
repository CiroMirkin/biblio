import type { DatosLibro, Libro, LiteraryForm } from "@shared/models"
import { formatName } from "@/utils/formatName"
import { formatTitulo } from "@/utils/formatTitulo"

export type CamposForm = Record<string, string | undefined>

/** Sin libroGuardado es un ingreso. Al editar, un autor vacio conserva el anterior */
export function libroDesdeLibroForm(campos: CamposForm, libroGuardado?: Libro): Omit<DatosLibro, "numeroInventario"> {
  return {
    titulo: formatTitulo(campos.titulo?.trim() ?? ""),
    autor: formatName(campos.autor ?? "") || libroGuardado?.autor || "",
    literaryForm: (campos.literaryForm || "u") as LiteraryForm,
    literaryGenres: campos.genres || "",
  }
}
