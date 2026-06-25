import type { DatosPrestamo, Libro, LibroRegistrado } from "./Libro"


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

/**
 * Signatura topográfica en formato Dewey + Cutter, con extensiones locales.
 * - **Prefijo** (opcional, 1–4 letras mayúsculas): indica colección o país de origen.
 * - **Dewey**: número de clasificación de 3 dígitos con decimales opcionales.
 * - **Cutter** (2–5 caracteres): código del autor derivado de las primeras letras del apellido.
 * - **Volumen** (opcional): `v.N` donde N es un entero.
 */
export interface CallNumber {
  prefix?: string
  dewey: string
  cutter: string
  volume?: string
}

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

export function isMarc21(libro: LibroRegistrado | Libro | Marc21): libro is Marc21EnPrestamo {
  return 'itemType' in libro && 'holding' in libro
}

/**
 * Deriva el cutter a partir de un autor en formato "Apellido, Nombre".
 * Retorna null si el formato es inválido, el apellido tiene 3 caracteres o menos,
 * o contiene un punto (abreviaturas como "Ma.").
 */
export function cutterFromAuthor(author: string): string {
  const match = author.match(/^([^,]+),\s*.+$/)
  if (!match) return ""

  const apellido = match[1].trim()
  if (apellido.length <= 3 || apellido.includes('.')) return ""

  return apellido.slice(0, 3).toUpperCase()
}

/**
 * Deriva un prefijo de colección a partir del nombre de un país.
 * Para países de una palabra retorna las primeras 2 letras en mayúsculas.
 * Para países compuestos retorna la inicial de cada palabra.
 * Elimina diacríticos antes de procesar.
 * Retorna null si el string está vacío.
 */
export function countryToPrefix(country: string): string {
  const words = country
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/\s+/)

  if (words.length === 0) return ""

  if (words.length === 1) {
    return words[0].slice(0, 2)
  }

  return words.map(w => w[0]).join('')
}

export function callNumberToString(callNumber: CallNumber | null | undefined): string {
 if (!callNumber) return ''

  const prefix = callNumber.prefix ?? ''
  const volume = callNumber.volume ? ` ${callNumber.volume}` : ''
  return `${prefix}${callNumber.dewey} ${callNumber.cutter}${volume}`
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
  
  return literaryFors.filter(f => f[0] === lf)[0][1]
}