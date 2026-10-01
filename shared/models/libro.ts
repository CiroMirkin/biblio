import type { CallNumber } from "./callNumber"
import type { Dewey } from "./dewey"
import type { LiteraryForm } from "./literaryForm"
import type { LiteraryGenre } from "./literaryGenre"
import type { Marc21ItemType } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

/** Datos del ejemplar fisico. Las sedes son '' cuando no se conocen */
export interface Holding {
    homeBranch: string
    holdingBranch: string
    barcode?: string
    publicNote?: string
    callNumber?: CallNumber
}

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string

    literaryForm?: LiteraryForm
    literaryGenres?: LiteraryGenre

    fechaDeIngreso?: Date | null

    itemType?: Marc21ItemType
    authorCountry?: string
    edition?: string
    placeOfPublication?: string
    publisher?: string
    publicationYear?: string
    dewey?: Dewey

    holding: Holding
}

export type LibroRegistrado = Libro & DatosPrestamo

/** Lo que se carga al ingresar o editar un libro. Las sedes que falten las completa el catalogo */
export type DatosLibro = Omit<Libro, "holding"> & { holding?: Partial<Holding> }

export const holdingVacio = (): Holding => ({ homeBranch: "", holdingBranch: "" })

export function isValidNumeroInventario(value: string | number | undefined): boolean {
  if (!value) return false

  const str = String(value).trim()
  if (!str) return false

  const digits = str.replace(/\D/g, '')
  if (!digits || Number(digits) === 0) return false

  return digits.length <= 5
}
