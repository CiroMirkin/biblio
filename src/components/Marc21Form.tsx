import type { KeyboardEvent, SyntheticEvent } from "react"
import type { Marc21ItemType } from "@shared/models"
import { useRef, useState } from "react"
import { useSettingsStore } from "@/store"

const ORDER = [
  "titulo", "autor", "barcode", "edition", "placeOfPublication",
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
  onSubmit: (e: SyntheticEvent) => Promise<boolean>
  homeBranch: string
  submitDisabled?: boolean
}

export function Marc21Form({ mode, submitLabel, onSubmit, submitDisabled, homeBranch }: Props) {
  const [tipoItem, setTipoItem] = useState<Marc21ItemType>("BK")
  const formRef = useRef<HTMLFormElement>(null)
  const { tipoDeIdEnLibros } = useSettingsStore()
  

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
          <input onKeyDown={handleEnter} type="text" name="titulo" id="titulo" required minLength={2} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Autor:</span>
          <input onKeyDown={handleEnter} type="text" name="autor" id="autor" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">{tipoDeIdEnLibros}: <span className="text-red">*</span></span>
          <input onKeyDown={handleEnter} type="text" name="barcode" id="barcode" required minLength={2} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Tipo de ítem: <span className="text-red">*</span></span>
          <select name="itemType" id="itemType" required value={tipoItem} onChange={(e) => setTipoItem(e.target.value as Marc21ItemType)} className={inputClass}>
            <option value="BK">Libro</option>
            <option value="DVD">DVD</option>
            <option value="MAP">Mapa</option>
            <option value="MX">Mixto</option>
            <option value="REF">Referencia</option>
            <option value="SER">Publicación periódica</option>
          </select>
        </label>

        {tipoItem === "BK" && (
          <label className="flex flex-col gap-1 text-base">
            <span className="font-semibold">Forma literaria:</span>
            <select name="literaryForm" id="literaryForm" defaultValue="" className={inputClass}>
              <option value="">Sin especificar</option>
              <option value="0">No es ficción</option>
              <option value="1">Ficción</option>
              <option value="c">Historietas</option>
              <option value="d">Dramas</option>
              <option value="e">Ensayos</option>
              <option value="f">Novelas</option>
              <option value="h">Humor, sátiras, etc.</option>
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
          <input onKeyDown={handleEnter} type="text" name="edition" id="edition" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Lugar de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="placeOfPublication" id="placeOfPublication" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Nombre de la Editorial:</span>
          <input onKeyDown={handleEnter} type="text" name="publisher" id="publisher" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Año de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="publicationYear" id="publicationYear" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Signatura topográfica:</span>
          <input onKeyDown={handleEnter} type="text" name="callNumber" id="callNumber" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">País de origen del autor:</span>
          <input onKeyDown={handleEnter} type="text" name="callNumberPrefix" id="callNumberPrefix" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Observaciones / Notas publicas:</span>
          <input onKeyDown={handleEnter} type="text" name="publicNote" id="publicNote" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span>Biblioteca propietaria:</span>
          <input type="text" value={!homeBranch ? "El nombre se define en AJUSTES" : homeBranch} disabled name="homeBranch" id="homeBranch" required className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} />
        </label>
      </div>

      <input type="submit" value={submitLabel} disabled={submitDisabled} className="px-4 py-2 btn mt-2" />
    </form>
  )
}
