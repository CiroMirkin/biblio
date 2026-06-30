import type { FormEvent, KeyboardEvent, Ref } from "react"
import { SubmitButton } from "@/components"

const ORDER = ["apellidos", "nombres", "dni", "fechaNacimiento", "telefono", "email", "domicilio", "observaciones"]

function focusSiguiente(name: string) {
  const index = ORDER.indexOf(name)
  if (index === -1 || index === ORDER.length - 1) return
  const siguiente = document.getElementById(ORDER[index + 1])
  siguiente?.focus()
}

function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return
  e.preventDefault()
  focusSiguiente((e.target as HTMLInputElement).name)
}

type InscripcionFormProps = {
  formRef: Ref<HTMLFormElement>
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  loading: boolean
  success: boolean
  submitDisabled?: boolean
  nroInvalido?: boolean
  submitLabel?: string
}

export function InscripcionForm({
  formRef,
  onSubmit,
  loading,
  success,
  submitDisabled = false,
  nroInvalido = false,
  submitLabel = "Inscribir",
}: InscripcionFormProps) {
  return (
    <form ref={formRef} className="flex flex-col gap-2 card" onSubmit={onSubmit}>
      <div className="w-full grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-base">
          Apellidos: *
          <input onKeyDown={handleEnter} type="text" name="apellidos" id="apellidos" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellidos" required />
        </label>

        <label className="flex flex-col gap-1 text-base">
          Nombres: *
          <input onKeyDown={handleEnter} type="text" name="nombres" id="nombres" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Nombres" required />
        </label>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-base">
          DNI:
          <input onKeyDown={handleEnter} type="text" name="dni" id="dni" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="DNI" />
        </label>

        <label className="flex flex-col gap-1 text-base">
          Fecha de nacimiento:
          <input onKeyDown={handleEnter} type="date" name="fechaNacimiento" id="fechaNacimiento" className="w-full border bg-white border-black rounded p-1 px-2" />
        </label>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-base">
          Numero de celular: *
          <input onKeyDown={handleEnter} type="tel" name="telefono" id="telefono" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Numero de celular" required minLength={10} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          Email:
          <input onKeyDown={handleEnter} type="email" name="email" id="email" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Email" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-base">
        Dirección:
        <input onKeyDown={handleEnter} type="text" name="domicilio" id="domicilio" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Dirección" />
      </label>

      <label className="flex flex-col gap-1 text-base">
        Observaciones generales:
        <input onKeyDown={handleEnter} type="text" name="observaciones" id="observaciones" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="" />
      </label>

        <SubmitButton
            type="submit"
            disabled={submitDisabled || nroInvalido}
            loading={loading}
            success={success}
            className="px-4 py-2 btn mt-2"
        >
            {submitLabel}
        </SubmitButton> 
    </form>
  )
}
