import type { CallNumber } from "./callNumber";
import type { Libro, LibroEnPrestamo, LibroRegistrado } from "./libro";
import type { Marc21LiteraryForm } from "./literaryForm";
import type { DatosPrestamo } from "./prestamo";

export type Marc21ItemType = "BK" | "DVD" | "MAP" | "MX" | "REF" | "SER"

/**
 * Registro de un libro en formato MARC 21.
| Columna Excel          | Campo MARC 21 | Descripción                    |
|------------------------|---------------|-------------------------------|
| `245$a Título`         | 245 $a        | Título (R)                       |
| `942$c Tipo ítem`      | 942 $c        | Tipo de material (R)             |
| `952$b Sede`           | 952 $b        | Biblioteca / sede (R)            |
| `952$p Código barras`  | 952 $p        | Código de barras del ejemplar (R) |
| `100$a Autor`          | 100 $a        | Autor principal  (op)             |
| `250$a Edición`        | 250 $a        | Mención de edición (op)           |
| `260$a Lugar`          | 260 $a        | Lugar de publicación  (op)        |
| `260$b Editor`         | 260 $b        | Editorial          (op)           |
| `260$c Año`            | 260 $c        | Año de publicación (op)           |
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

  holding: {
    homeBranch: string
    holdingBranch: string
    barcode?: string
    publicNote?: string
    callNumber?: CallNumber | null
  }
}

export type Marc21EnPrestamo = Marc21 & DatosPrestamo

export function isMarc21(libro: LibroRegistrado | undefined): libro is Marc21EnPrestamo {
  if(!libro) return false

  if('itemType' in libro && 'holding' in libro) {
    const holding = libro.holding
    
    if('callNumber' in holding) {
      const callNumber = holding.callNumber
      const existeCallNumber = callNumber !== undefined && callNumber !== null

      if(existeCallNumber) {
        return 'dewey' in callNumber && String(callNumber.dewey || "").trim() !== ""
      }
    }
  }

  return false
}

export function makeBlankMark21(libro: Libro | LibroEnPrestamo): Marc21 {
  return {
    ...libro,
    itemType: "BK",
    holding: {
      barcode: "",
      holdingBranch: "",
      homeBranch: "",
      callNumber: {
        dewey: "",
        cutter: "",
      },
    },
  }
}

export function parceLiteraryForm(lf: Marc21LiteraryForm | undefined) {
  if(!lf) return ""
  
  const literaryFors = [
    ["0","No es ficción"],
    ["c", "Historieta"],
    ["e", "Ensayo"],
    ["1", "Ficción"],
    ["h", "Humor, sátiras, etc."],
    ["d", "Drama"],
    ["j", "Cuentos"],
    ["f", "Novela"],
    ["p", "Poesía"],
    ["i", "Cartas"],
    ["u", "Desconocido"],
    ["m", "Formas mixtas"],
    ["s", "Discursos"],
  ]
  
  return literaryFors.find(f => f[0] === lf)?.[1] ?? ""
}
