
export type CaracterSocio = "Inactivo" | "inactivo-automatico" | "regular-automatico" | "Regular" | ""

export interface Socio {
  nroSocio: number
  nombreYApellido: string // los apellidos se separan mediante una coma
  telefono: string | null
  dni?: number
  domicilio?: string
  nacionalidad?: string
  fechaNacimiento?: Date
  caracterSocio?: CaracterSocio
  email?: string
  fechaIngresoEgreso?: Date
  observaciones?: string
}

export type NewSocio = Omit<Socio, 'nroSocio'>
