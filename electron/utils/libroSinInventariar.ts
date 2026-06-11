import { randomUUID } from "node:crypto"

export function esSinInventariar(id: string | number): boolean {
  return id.toString().startsWith('SN-')
}

export function generarIdSinInventariar(): string {
  return `SN-${randomUUID()}`
}