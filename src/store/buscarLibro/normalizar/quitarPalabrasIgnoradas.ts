export const PALABRAS_IGNORADAS = new Set([
  "el", "la", "los", "las", "lo",
  "un", "una", "unos", "unas",
  "de", "del", "y", "e", "a", "al", "en",
])

export const esPalabraIgnorada = (palabra: string) => PALABRAS_IGNORADAS.has(palabra)

// Si todas son ignoradas se usan igual, para poder buscar "lo que el"
export function quitarPalabrasIgnoradas(palabras: string[]): string[] {
  const significativas = palabras.filter(palabra => !esPalabraIgnorada(palabra))
  return significativas.length ? significativas : palabras
}
