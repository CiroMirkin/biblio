// NFD separa la letra de su tilde, asi la ñ queda como n
export const quitarTildes = (texto: string) => texto
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
