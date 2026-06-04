import type { Socio } from "@/models/Socio"

export async function cargarSocios(): Promise<Socio[]> {
  const raw = await window.electronAPI.getSocios()

  return raw.map((s: unknown): Socio => {
    const socio = s as Socio
    return {
      ...socio,
      fechaNacimiento: socio.fechaNacimiento as string,
      fechaIngreso: socio.fechaIngreso as string,
      fechaEgreso: socio.fechaEgreso as string,
    }
  })
}