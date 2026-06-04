export interface Socio {
  nroSocio: number
  nombreYApellido: string
  domicilio: string
  dni: number
  telefono: string | null
  fechaNacimiento: String | null
  caracterSocio: string
  fechaIngreso: String | null
  fechaEgreso: String | null
  observaciones: string
  email: string
}

export type NewSocioData = Omit<Socio, 'nroSocio'>
