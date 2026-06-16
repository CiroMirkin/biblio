export interface Socio {
  nroSocio: NroSocio
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
  sociosVinculados: NroSocio[]
}

export type NroSocio = number

export type NewSocioData = Omit<Socio, 'nroSocio'>
