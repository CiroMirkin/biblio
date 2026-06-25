

/**
 * Signatura topográfica en formato Dewey + Cutter, con extensiones locales.
 *
 * Formato: `[PREFIJO][DEWEY] [CUTTER][ v.N]`
 *
 * **Prefijo** (opcional, 1–4 letras mayúsculas): indica colección o país de origen.
 * Puede ir pegado al número Dewey o separado por un espacio.
 * - `A`    → Argentina
 * - `Ur`   → Uruguay
 * - `a`    → adultos (subcollección local)
 *
 * **Dewey**: número de clasificación de 3 dígitos con decimales opcionales.
 * - `863`
 * - `155.94`
 *
 * **Cutter** (2–5 caracteres): código del autor derivado de las primeras letras del apellido.
 * Admite caracteres del español y diacríticos del alemán y otras lenguas (Ñ, Ö, Ü, Ä, etc.).
 * - `AVE`
 * - `CAÑ`
 * - `BÖH`
 *
 * **Volumen** (opcional): `v.N` donde N es un entero.
 * - `v.2`
 * - `v.10`
 *
 * Ejemplos válidos:
 * ```
 * 853 ALI
 * 155.94 ROV
 * A863 AGU
 * A 863 AGU
 * Ur863 BEN
 * Ur 863 BEN
 * 982 COO v.2
 * A863 BÖH
 * ```
 */
export interface CallNumber {
  prefix?: string
  dewey: string
  cutter: string
  volume?: string
}


/** Objeto a String */
export function formatCallNumber(callNumber: CallNumber | null | undefined): string {
 if (!callNumber) return ''

  const prefix = callNumber.prefix ?? ''
  const volume = callNumber.volume ? ` ${callNumber.volume}` : ''
  return `${prefix}${callNumber.dewey} ${callNumber.cutter}${volume}`
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