
/** Forma literaria según Marc21 */
export type LiteraryForm = 
    "0" | // No es ficción
    "1" | // Ficción
    "c" | // Historietas
    "d" | // Dramas
    "e" | // Ensayos
    "f" | // Novelas
    "h" | // Humor, sátiras, etc.
    "i" | // Cartas
    "j" | // Cuentos
    "m" | // Formas mixtas
    "p" | // Poesía
    "s" | // Discursos
    "u" // Desconocido

export type Genero = 
    "No ficción" |
    "Ficción" |
    "Historieta" |
    "Dramas" |
    "Ensayo" |
    "Novela" |
    "Humor, sátiras, etc." |
    "Cartas" |
    "Cuentos" |
    "Formas mixtas" |
    "Poesía" |
    "Discursos" |
    "Desconocido"

export const marc21LiteraryForm: Record<LiteraryForm, Genero> = {
    "0": "No ficción",
    "1": "Ficción",
    "c": "Historieta",
    "d": "Dramas",
    "e": "Ensayo",
    "f": "Novela",
    "h": "Humor, sátiras, etc.",
    "i": "Cartas",
    "j": "Cuentos",
    "m": "Formas mixtas",
    "p": "Poesía",
    "s": "Discursos",
    "u": "Desconocido",
}

export function formatLiteraryForm(lf: LiteraryForm | undefined): Genero {
  if (!lf) return "Desconocido"
  return marc21LiteraryForm[lf] ?? "Desconocido"
}

