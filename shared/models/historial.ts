
export interface HistorialEntry {
  idPrestamo: string
  fechaPrestamo: Date
  fechaDevolucion: Date | null
  nroSocio: number
  nroLibro: string
}

export interface EstadoHistorial {
  registros: number
  limite: number
  /** año de devolución más antiguo, null si no hay préstamos devueltos */
  anio: number | null
  cantidad: number
}
