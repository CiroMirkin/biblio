import type { CallNumber } from "./callNumber";
import type { Dewey } from "./dewey";
import type { Libro, LibroEnPrestamo, LibroRegistrado } from "./libro";
import type { DatosPrestamo } from "./prestamo";

export type Marc21ItemType = "BK" | "DVD" | "MAP" | "MX" | "REF" | "SER"

/**
 * Registro de un libro en formato MARC 21.
| Columna Excel          | Campo MARC 21 | Descripción                       |
|------------------------|---------------|------------------------------------|
| `245$a Título`         | 245 $a        | Título (R)                        |
| `942$c Tipo ítem`      | 942 $c        | Tipo de material (R)              |
| `952$a Sede`           | 952 $a        | Biblioteca de origen / sede (R)   |
| `952$p N° inventario`  | 952 $p        | Código de barras / N° de inventario del ejemplar (R) |
| `100$a Autor`          | 100 $a        | Autor principal  (op)             |
| `020$a ISBN`           | 020 $a        | ISBN                (op)          |
| `250$a Edición`        | 250 $a        | Mención de edición (op)           |
| `260$a Lugar`          | 260 $a        | Lugar de publicación  (op)        |
| `260$b Editor`         | 260 $b        | Editorial          (op)           |
| `260$c Año`            | 260 $c        | Año de publicación (op)           |
| `952$b Sede retención` | 952 $b        | Biblioteca de retención    (op)   |
| `952$z Observaciones`  | 952 $z        | Nota pública              (op)    |
| `952$o Signatura`      | 952 $o        | Signatura topográfica    (op)     |
 */

export interface Marc21 extends Libro {
  authorCountry?: string
  itemType: Marc21ItemType

  edition?: string
  placeOfPublication?: string
  publisher?: string
  publicationYear?: string
  dewey?: Dewey
  volume?: string

  holding: {
    homeBranch: string
    holdingBranch: string
    barcode?: string
    publicNote?: string
    callNumber?: CallNumber
  }
}

export type Marc21EnPrestamo = Marc21 & DatosPrestamo

function tieneValor(valor: unknown): boolean {
  if (typeof valor === "number") return !isNaN(valor)
  return valor !== undefined && valor !== null && valor !== ""
}

export function isMarc21(libro: LibroRegistrado | undefined): libro is Marc21EnPrestamo {
  if (!libro) return false

  if (!('itemType' in libro)) return false

  return (
    tieneValor(libro?.edition) ||
    tieneValor(libro?.placeOfPublication) ||
    tieneValor(libro?.publisher) ||
    tieneValor(libro?.publicationYear) ||
    tieneValor(libro?.authorCountry) ||
    tieneValor(libro?.dewey) ||
    tieneValor(libro.holding?.callNumber) ||
    tieneValor(libro.holding?.barcode)
  )
}

export function makeBlankMark21(libro: Libro | LibroEnPrestamo): Marc21 {
  return {
    ...libro,
    itemType: "BK",
    holding: {
      barcode: "",
      holdingBranch: "",
      homeBranch: "",
      callNumber: "",
    },
  }
}

