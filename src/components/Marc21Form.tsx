import type { KeyboardEvent, SyntheticEvent } from "react"
import { formatCallNumber, type Marc21, type Marc21ItemType } from "@shared/models"
import { useRef, useState } from "react"
import { cn } from "@/utils"
import { NroInventarioInput } from "./NroInventarioInput"

const ORDER = [
  "titulo", "autor", "numeroInventario", "barcode", "edition", "placeOfPublication",
  "publisher", "publicationYear", "callNumber", "callNumberPrefix", "publicNote",
]

function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return
  e.preventDefault()
  const index = ORDER.indexOf((e.target as HTMLInputElement).name)
  if (index === -1 || index === ORDER.length - 1) return
  document.getElementById(ORDER[index + 1])?.focus()
}

const inputClass = "w-full border bg-white border-black rounded p-1 px-2"

interface Props {
  mode: "ingreso" | "edicion"
  submitLabel: string
  onSubmit: (e: SyntheticEvent) => Promise<boolean | void>
  homeBranch: string
  submitDisabled?: boolean
  defaultValues?: Marc21
}

export function Marc21Form({
  mode, submitLabel, onSubmit, submitDisabled, homeBranch, defaultValues
}: Props) {
  const [tipoItem, setTipoItem] = useState<Marc21ItemType>(defaultValues?.itemType ?? "BK")
  const [ nroInvalido, setNroComoInvalido ] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: SyntheticEvent) => {
    const ok = await onSubmit(e)
    if (!ok) return
    if (mode === "ingreso") {
      formRef.current?.reset()
      setTipoItem("BK")
    }
  }

  return (
    <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Título: <span className="text-red">*</span></span>
          <input onKeyDown={handleEnter} type="text" name="titulo" id="titulo" required minLength={2} defaultValue={defaultValues?.titulo ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Autor:</span>
          <input onKeyDown={handleEnter} type="text" name="autor" id="autor" defaultValue={defaultValues?.autor ?? ""} className={inputClass} />
        </label>

        <NroInventarioInput 
          mode={mode}
          onKeyDown={handleEnter}
          defaultValue={defaultValues?.numeroInventario ?? ""}
          inputClass={inputClass}
          onNroInvalid={setNroComoInvalido}
        />

        {tipoItem === "BK" && (
          <label className="flex flex-col gap-1 text-base">
            <span className="font-semibold">Forma literaria:</span>
            <select name="literaryForm" id="literaryForm" defaultValue={defaultValues?.literaryForm ?? ""} className={inputClass}>
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
        )}

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Tipo o Numero de Edición:</span>
          <input onKeyDown={handleEnter} type="text" name="edition" id="edition" defaultValue={defaultValues?.edition ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Lugar de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="placeOfPublication" id="placeOfPublication" defaultValue={defaultValues?.placeOfPublication ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Nombre de la Editorial:</span>
          <input onKeyDown={handleEnter} type="text" name="publisher" id="publisher" defaultValue={defaultValues?.publisher ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Año de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="publicationYear" id="publicationYear" defaultValue={defaultValues?.publicationYear ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Signatura topográfica:</span>
          <input onKeyDown={handleEnter} step="0.01" type={ mode == "ingreso" ? "number": "text" } name="callNumber" id="callNumber" defaultValue={ formatCallNumber(defaultValues?.holding.callNumber) ?? "" } className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">País de origen del autor:</span>
          <input onKeyDown={handleEnter} type="text" name="callNumberPrefix" id="callNumberPrefix" defaultValue={defaultValues?.authorCountry ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Observaciones / Notas publicas:</span>
          <input onKeyDown={handleEnter} type="text" name="publicNote" id="publicNote" defaultValue={defaultValues?.holding.publicNote ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span>Biblioteca propietaria:</span>
          <input type="text" value={!homeBranch ? "El nombre se define en AJUSTES" : homeBranch} disabled name="homeBranch" id="homeBranch" required className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} />
        </label>
      </div>

      <input
        type="submit"
        value={submitLabel}
        disabled={submitDisabled || nroInvalido}
        className={cn(
          "px-4 py-2 btn mt-2",
          submitDisabled && "btn-disabled",
          nroInvalido && "btn-disabled",
        )}
        />
    </form>
  )
}