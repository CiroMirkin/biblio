import type { KeyboardEvent, SyntheticEvent } from "react"
import { formatLiteraryForm, getDeweyFromCallNumber, type LiteraryForm, type Marc21, type Marc21ItemType } from "@shared/models"
import { useRef, useState } from "react"
import { SubmitButton } from "@/components"
import { NroInventarioInput } from "./NroInventarioInput"
import { CallNumberInput } from "./CallNumberInput"
import { DeweyInput } from "./DeweyInput"

const ORDER = [
  "titulo", "autor", "numeroInventario", "barcode", "literaryGenres", "callNumberPrefix", "dewey", "publisher", "placeOfPublication", "edition", "publicationYear", "publicNote",
]

function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return
  e.preventDefault()
  const index = ORDER.indexOf((e.target as HTMLInputElement).name)
  if (index === -1 || index === ORDER.length - 1) return
  document.getElementById(ORDER[index + 1])?.focus()
}

const inputClass = "w-full border bg-white border-black rounded p-1 px-2 placeholder:opacity-85"

interface Props {
  mode: "ingreso" | "edicion"
  submitLabel: string
  onSubmit: (e: SyntheticEvent) => Promise<boolean | void>
  submitDisabled?: boolean
  defaultValues?: Marc21
  onSuccess?: () => void
}

export function Marc21Form({
  mode, submitLabel, onSubmit, submitDisabled, defaultValues, onSuccess = () => {}
}: Props) {
  const [tipoItem, setTipoItem] = useState<Marc21ItemType>(defaultValues?.itemType ?? "BK")
  const [ nroInvalido, setNroComoInvalido ] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [autor, setAutor] = useState(defaultValues?.autor ?? "")
  const [country, setCountry] = useState(defaultValues?.authorCountry ?? "")
  const d = defaultValues?.dewey?.toString() ?? getDeweyFromCallNumber(defaultValues?.holding?.callNumber)?.toString()
  const [dewey, setDewey] = useState(d || "")
  const [literaryForm, setLiteraryForm] = useState<LiteraryForm>(defaultValues?.literaryForm ?? "u")
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: SyntheticEvent) => {
    if (loading) return false
    
    setLoading(true)
    const ok = await onSubmit(e)
    setLoading(false)
    if (!ok) return false

    if (mode === "ingreso") {
      formRef.current?.reset()
      setTipoItem("BK")
      setAutor("")
      setCountry("")
      setDewey("")
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 1500)
    onSuccess()
  }

  return (
    <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <NroInventarioInput 
        mode={mode}
        onKeyDown={handleEnter}
        defaultValue={defaultValues?.numeroInventario ?? ""}
        inputClass={inputClass}
        onNroInvalid={setNroComoInvalido}
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Título: <span className="text-red">*</span></span>
          <input onKeyDown={handleEnter} type="text" name="titulo" id="titulo" required minLength={2} defaultValue={defaultValues?.titulo ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Autor:</span>
          <input onKeyDown={handleEnter} onChange={e => setAutor(e.target.value)} type="text" name="autor" id="autor" value={autor} className={inputClass} placeholder="Apellido, nombre" />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Código de barras (ISBN):</span>
          <input onKeyDown={handleEnter} type="text" name="barcode" id="barcode" minLength={8} defaultValue={defaultValues?.holding.barcode ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Genero literario:</span>
          <input onKeyDown={handleEnter} type="text" name="genres" id="genres" defaultValue={defaultValues?.literaryGenres ?? ""} className={inputClass} />
        </label>


        {tipoItem === "BK" && (
          <label className="flex flex-col gap-1 text-base">
            <span className="font-semibold">Forma literaria:</span>
            <select onChange={e => setLiteraryForm(e.target.value as LiteraryForm)} name="literaryForm" id="literaryForm" value={literaryForm} className={inputClass}>
              <option value="u">Desconocido</option>
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
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">País de origen del autor:</span>
          <input onKeyDown={handleEnter} onChange={e => setCountry(e.target.value)} type="text" name="callNumberPrefix" id="callNumberPrefix" value={country} className={inputClass} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <DeweyInput
            onKeyDown={handleEnter}
            country={country}
            genero={formatLiteraryForm(literaryForm)}
            value={dewey}
            onChange={setDewey}
            inputClass={inputClass}
          />

          <CallNumberInput
            mode={mode}
            autor={autor}
            country={country}
            dewey={dewey}
            defaultValue={defaultValues?.holding.callNumber ?? ""}
            inputClass={inputClass}
          />
        </div>

        <div></div>

        <label className="mt-5 flex flex-col gap-1 text-base">
          <span className="font-semibold">Nombre de la Editorial:</span>
          <input onKeyDown={handleEnter} type="text" name="publisher" id="publisher" defaultValue={defaultValues?.publisher ?? ""} className={inputClass} />
        </label>

        <label className="mt-5 flex flex-col gap-1 text-base">
          <span className="font-semibold">Lugar de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="placeOfPublication" id="placeOfPublication" defaultValue={defaultValues?.placeOfPublication ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Tipo o Numero de Edición:</span>
          <input onKeyDown={handleEnter} type="text" name="edition" id="edition" defaultValue={defaultValues?.edition ?? ""} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-base">
          <span className="font-semibold">Año de publicación:</span>
          <input onKeyDown={handleEnter} type="text" name="publicationYear" id="publicationYear" defaultValue={defaultValues?.publicationYear ?? ""} className={inputClass} />
        </label>

        <label className="mt-2 col-span-2 flex flex-col gap-1 text-base">
          <span className="font-semibold">Observaciones / Notas publicas:</span>
          <input onKeyDown={handleEnter} type="text" name="publicNote" id="publicNote" defaultValue={defaultValues?.holding.publicNote ?? ""} className={inputClass} />
        </label>
      </div>

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