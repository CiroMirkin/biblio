import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CampoInscripcion = "dni" | "fechaNacimiento" | "telefono" | "email" | "domicilio"

export const CAMPOS_INSCRIPCION: { key: CampoInscripcion; label: string }[] = [
  { key: "dni", label: "DNI" },
  { key: "fechaNacimiento", label: "fecha de nacimiento" },
  { key: "telefono", label: "numero de celular" },
  { key: "email", label: "email" },
  { key: "domicilio", label: "dirección" },
]

type CamposInscripcionState = {
  camposRequeridos: Record<CampoInscripcion, boolean>
  setCampoRequerido: (campo: CampoInscripcion, requerido: boolean) => void
}

const DEFAULT_CAMPOS_REQUERIDOS: Record<CampoInscripcion, boolean> = {
  dni: false,
  fechaNacimiento: false,
  telefono: true,
  email: false,
  domicilio: false,
}

export const useCamposInscripcionStore = create<CamposInscripcionState>()(
  persist(
    (set) => ({
      camposRequeridos: DEFAULT_CAMPOS_REQUERIDOS,
      setCampoRequerido: (campo, requerido) =>
        set((state) => ({
          camposRequeridos: { ...state.camposRequeridos, [campo]: requerido },
        })),
    }),
    { name: "campos-inscripcion" },
  ),
)