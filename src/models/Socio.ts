
export type CaracterSocio = "Inactivo" | "inactivo-automatico" | "regular-automatico" | "Regular" | "" | "cuotas-desactualizadas"

export interface Socio {
  nroSocio: number
  nombreYApellido: string // los apellidos se separan mediante una coma
  telefono: string | null
  dni?: number
  domicilio?: string
  fechaNacimiento?: String | null
  caracterSocio: string
  fechaIngreso?: String | null
  fechaEgreso?: String | null
  observaciones?: string
  email: string
}

export type NewSocio = Omit<Socio, 'nroSocio'>
