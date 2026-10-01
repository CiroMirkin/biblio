import { calcularCallNumber, formatCountry, type DatosLibro, type Libro } from "@shared/models"
import { validateISBN } from "@shared/utils"
import { formatName } from "@/utils/formatName"
import { formatTitulo } from "@/utils/formatTitulo"
import { libroDesdeLibroForm, type CamposForm } from "./libroDesdeLibroForm"

/**
 * No toca la sede ni el itemType, al ingresar los completa el catalogo y al editar se conservan.
 * La signatura escrita a mano solo vale al editar un libro que ya tenia una, igual que en CallNumberInput.
 */
export function libroDesdeMarc21Form(campos: CamposForm, libroGuardado?: Libro): Omit<DatosLibro, "numeroInventario"> {
  const autor = campos.autor ?? ""
  const deweyTexto = campos.dewey ?? ""
  const dewey = parseFloat(deweyTexto.replace(",", "."))
  const signaturaManual = !!libroGuardado?.holding.callNumber

  return {
    ...libroDesdeLibroForm(campos, libroGuardado),
    edition: campos.edition || "",
    placeOfPublication: formatName(campos.placeOfPublication ?? ""),
    publisher: formatName(campos.publisher ?? ""),
    publicationYear: campos.publicationYear || "",
    authorCountry: formatCountry(campos.callNumberPrefix ?? ""),
    dewey: isNaN(dewey) ? undefined : dewey,
    holding: {
      barcode: validateISBN(campos.barcode ?? "") ? campos.barcode : "",
      publicNote: formatTitulo(campos.publicNote ?? ""),
      callNumber: signaturaManual
        ? campos.callNumber ?? ""
        : calcularCallNumber(campos.callNumberPrefix ?? "", deweyTexto, autor),
    },
  }
}
