import { formatCountry, type Dewey } from "./dewey"

/** 
 * Signatura topográfica en formato Dewey + Cutter, con extensiones locales.
 *
 * Formato: `[PREFIJO] [DEWEY] [CUTTER][ v.N]`
 * 
 * Formato: `[País] [Clasificación] [Autor] [Tomo-Volumen]`
 * */
export type CallNumber = string | undefined


const UMLAUT_MAP: Record<string, string> = {
  'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U',
  'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
  'Â': 'A', 'Ê': 'E', 'Î': 'I', 'Ô': 'O', 'Û': 'U',
  'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O',
  'Ñ': 'Ñ',
}

const CUTTER_CHARS = 'A-ZÁÉÍÓÚÜÑÀÈÌÒÙÂÊÎÔÛÄËÏÖ'

const CALL_NUMBER_PATTERN = new RegExp(
  `^[A-Z]{0,4}\\d{3}(\\.\\d+)?\\s[${CUTTER_CHARS}]{2,5}(\\sv\\.\\d+)?$`
)

export function isValidCallNumber(callNumber: string): boolean {
  return CALL_NUMBER_PATTERN.test(normalizeCallNumber(callNumber))
}

export function normalizeCallNumber(callNumber: string): string {
  return callNumber
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]{1,4})\s(\d)/, '$1$2')
    .replace(/\s+/g, ' ')
    .replace(/[ÁÉÍÓÚÜÀÈÌÒÙÂÊÎÔÛÄËÏÖ]/g, c => UMLAUT_MAP[c] ?? c)
    .replace(/V\.(\d+)/, 'v.$1')
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
  const words = formatCountry(country)
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

export function getDeweyFromCallNumber(callNumber: string | undefined): Dewey | undefined {
  if(!callNumber || !callNumber.trim()) return undefined

  const forValidation = normalizeCallNumber(callNumber)
  const match = forValidation.match(
    new RegExp(`^([A-Z]{1,4})?(\\d{3}(?:\\.\\d+)?)\\s([${CUTTER_CHARS}]{2,5})(?:\\s(v\\.\\d+))?$`)
  )
  if(!match) return undefined
  return Number(match[2])
}
