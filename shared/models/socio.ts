
export interface Socio {
  nroSocio: NroSocio
  nombreYApellido: string // los apellidos se separan mediante una coma
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

export type NewSocio = Omit<Socio, 'nroSocio'>
