import type { Socio } from "@/models/Socio"

export async function cargarSocios(): Promise<Socio[]> {
  const raw = await window.electronAPI.getSocios()

  return raw.map((s: Record<string, unknown>) => ({
    ...s,
    fechaNacimiento: new Date(s.fechaNacimiento as string),
    fechaIngresoEgreso: new Date(s.fechaIngresoEgreso as string),
  })) as Socio[]
}
