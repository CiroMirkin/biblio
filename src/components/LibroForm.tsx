import { cn } from "@/utils"
import type { Marc21LiteraryForm } from "@shared/models"
import type { KeyboardEvent, SyntheticEvent } from "react"
import { useRef } from "react"

const ORDER = ["numeroInventario", "titulo", "autor"]

function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return
  e.preventDefault()
  const index = ORDER.indexOf((e.target as HTMLInputElement).name)
  if (index === -1 || index === ORDER.length - 1) return
  document.getElementById(ORDER[index + 1])?.focus()
}

interface Props {
  mode: "ingreso" | "edicion"
  submitLabel: string
  onSubmit: (e: SyntheticEvent) => Promise<boolean | void>
  defaultValues?: {
    numeroInventario?: string | number; titulo?: string; autor?: string, literaryForm?: Marc21LiteraryForm
  }
  submitDisabled?: boolean
}

export function LibroForm({ mode, submitLabel, onSubmit, defaultValues = {}, submitDisabled = false }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: SyntheticEvent) => {
    const ok = await onSubmit(e)
    if (!ok) return
    if (mode === "ingreso") formRef.current?.reset()
  }

  return (
    <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">N° de inventario: </span>
          <input onKeyDown={handleEnter} type="text" name="numeroInventario" id="numeroInventario" defaultValue={defaultValues.numeroInventario ?? ""} className="w-full border bg-white border-black rounded p-1 px-2" />
        </label>
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Forma literaria:</span>
          <select name="literaryForm" id="literaryForm" defaultValue={defaultValues?.literaryForm ?? ""} className="w-full border bg-white border-black rounded p-1 px-2">
            <option value="">Sin especificar</option>
            <option value="0">No es ficción</option>
            <option value="1">Ficción</option>
            <option value="c">Historieta</option>
            <option value="d">Drama</option>
            <option value="e">Ensayo</option>
            <option value="f">Novela</option>
            <option value="h">Humor, sátira, etc.</option>
            <option value="i">Cartas</option>
            <option value="j">Cuentos</option>
            <option value="m">Formas mixtas</option>
            <option value="p">Poesía</option>
            <option value="s">Discursos</option>
            <option value="u">Desconocido</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Título: <span className="text-red">*</span></span>
          <input onKeyDown={handleEnter} type="text" name="titulo" id="titulo" required minLength={2} defaultValue={defaultValues.titulo ?? ""} className="w-full border bg-white border-black rounded p-1 px-2" />
        </label>
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Autor:</span>
          <input onKeyDown={handleEnter} type="text" name="autor" id="autor" defaultValue={defaultValues.autor ?? ""} className="w-full border bg-white border-black rounded p-1 px-2" />
        </label>
      </div>
      <input
        type="submit"
        value={submitLabel}
        className={cn("px-4 py-2 btn mt-2", submitDisabled && "btn-disabled")}
        disabled={submitDisabled}
      />
    </form>
  )
}