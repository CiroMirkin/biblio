import type { CallNumber } from "./callNumber";
import type { LibroRegistrado } from "./libro";
import type { DatosPrestamo } from "./prestamo";

export type Marc21ItemType = "BK" | "DVD" | "MAP" | "MX" | "REF" | "SER"

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
    publicNote?: string
    callNumber?: CallNumber | null
  }
}

export type Marc21EnPrestamo = Marc21 & DatosPrestamo

export function isMarc21(libro: LibroRegistrado): libro is Marc21EnPrestamo {
  return 'itemType' in libro && 'holding' in libro
}