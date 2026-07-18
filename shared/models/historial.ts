
export interface HistorialEntry {
  idPrestamo: string
  fechaPrestamo: Date
  fechaDevolucion: Date | null
  nroSocio: number
  nroLibro: string
}
