import type { DatosPrestamo, LibroRegistrado } from "./Libro"


export type Marc21ItemType =  "BK" | "DVD" | "MAP" | "MX" | "REF" | "SER"

export type Marc21LiteraryForm =
  | "0" // No es ficción
  | "1" // Ficción
  | "c" // Historietas
  | "d" // Dramas
  | "e" // Ensayos
  | "f" // Novelas
  | "h" // Humor, sátiras, etc.
  | "i" // Cartas
  | "j" // Cuentos
  | "m" // Formas mixtas
  | "p" // Poesía
  | "s" // Discursos
  | "u" // Desconocido

export interface Marc21 {
  numeroInventario?: number | string

  titulo: string
  autor?: string
  itemType: Marc21ItemType
  literaryForm?: Marc21LiteraryForm

  edition?: string
  placeOfPublication?: string
  publisher?: string
  publicationYear?: string

  holding: {
    homeBranch: string
    holdingBranch: string
    barcode: string
    shelvingLocation?: string
    callNumber?: string
  }
}

export type Marc21EnPrestamo = Marc21 & DatosPrestamo

export function isMarc21(libro: LibroRegistrado): libro is Marc21EnPrestamo {
  return 'itemType' in libro && 'holding' in libro
}
