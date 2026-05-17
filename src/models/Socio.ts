export interface Socio {
  nroSocio: number
  nombreYApellido: string // los apellidos se separan mediante una coma
  telefono: string | null
  dni?: number
  domicilio?: string
  nacionalidad?: string
  fechaNacimiento?: Date
  caracterSocio?: string
  email?: string
  fechaIngresoEgreso?: Date
  observaciones?: string
}
