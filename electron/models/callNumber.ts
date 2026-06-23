
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

export function normalizeCallNumber(callNumber: string): string {
  return callNumber
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]{1,4})\s(\d)/, '$1$2')
    .replace(/\s+/g, ' ')
    .replace(/[ÁÉÍÓÚÜÀÈÌÒÙÂÊÎÔÛÄËÏÖ]/g, c => UMLAUT_MAP[c] ?? c)
    .replace(/V\.(\d+)/, 'v.$1')
}

export function isValidCallNumber(callNumber: string): boolean {
  return CALL_NUMBER_PATTERN.test(normalizeCallNumber(callNumber))
}

/** String a Objeto */
export function parseCallNumber(callNumber: string): CallNumber | null {
  const forValidation = normalizeCallNumber(callNumber)
  const match = forValidation.match(
    new RegExp(`^([A-Z]{1,4})?(\\d{3}(?:\\.\\d+)?)\\s([${CUTTER_CHARS}]{2,5})(?:\\s(v\\.\\d+))?$`)
  )
  if (!match) return null

  const originalCutter = callNumber
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]{1,4})\s(\d)/, '$1$2')
    .replace(/\s+/g, ' ')
    .match(new RegExp(`^[A-Z]{0,4}\\d{3}(?:\\.\\d+)?\\s([${CUTTER_CHARS}]{2,5})`))

  return {
    prefix: match[1],
    dewey: match[2],
    cutter: originalCutter?.[1] ?? match[3],
    volume: match[4],
  }
}

/** Objeto a String */
export function formatCallNumber(callNumber: CallNumber | null | undefined): string {
 if (!callNumber) return ''

  const prefix = callNumber.prefix ?? ''
  const volume = callNumber.volume ? ` ${callNumber.volume}` : ''
  return `${prefix}${callNumber.dewey} ${callNumber.cutter}${volume}`
}
