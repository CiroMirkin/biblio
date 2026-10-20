export const quitarSignos = (texto: string) => texto.replace(/[^\p{L}\p{N}\s]/gu, " ")
