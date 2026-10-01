import type { Libro } from "./libro";

export type Marc21ItemType = "BK" | "DVD" | "MAP" | "MX" | "REF" | "SER"

/**
 * Columnas MARC 21 de un libro en la hoja Excel.
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

function tieneValor(valor: unknown): boolean {
  if (typeof valor === "number") return !isNaN(valor)
  return valor !== undefined && valor !== null && valor !== ""
}

/** La sede y el itemType no cuentan porque un libro cargado en modo simple tambien puede tenerlos */
export function tieneDatosMarc(libro: Libro | undefined | null): boolean {
  if (!libro) return false

  return (
    tieneValor(libro.edition) ||
    tieneValor(libro.placeOfPublication) ||
    tieneValor(libro.publisher) ||
    tieneValor(libro.publicationYear) ||
    tieneValor(libro.authorCountry) ||
    tieneValor(libro.dewey) ||
    tieneValor(libro.holding?.callNumber) ||
    tieneValor(libro.holding?.barcode) ||
    tieneValor(libro.holding?.publicNote)
  )
}
