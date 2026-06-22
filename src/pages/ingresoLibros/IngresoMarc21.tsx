import { CheckIcon } from "@/components"
import { useRef, useState } from "react"
import type { KeyboardEvent, SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { Marc21, Marc21ItemType } from "@/models"
import { useLibrosStore, useSettingsStore } from "@/store"

const ORDER = [
  "titulo",
  "autor",
  "barcode",
  "edition",
  "placeOfPublication",
  "publisher",
  "publicationYear",
  "shelvingLocation",
  "callNumber",
]

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

export function IngresoMarc21() {
  const { ingresoMark21 } = useLibrosStore()
  const formRef = useRef<HTMLFormElement>(null)
  const [exito, setExito] = useState(false)
  const [tipoItem, setTipoItem] = useState<Marc21ItemType>("BK")
  const { nombreBiblioteca, estaDefinidoNombreBiblioteca } = useSettingsStore()
  const homeBranch = estaDefinidoNombreBiblioteca() ? nombreBiblioteca : ''

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const registro: Marc21 = {
      numeroInventario: form.barcode.value,
      titulo: form.titulo.value,
      autor: form.autor.value || undefined,
      itemType: form.itemType.value,
      literaryForm: tipoItem === "BK" ? (form.literaryForm.value || undefined) : undefined,
      edition: form.edition.value || undefined,
      placeOfPublication: form.placeOfPublication.value || undefined,
      publisher: form.publisher.value || undefined,
      publicationYear: form.publicationYear.value || undefined,
      holding: {
        homeBranch: homeBranch,
        holdingBranch: homeBranch,
        barcode: form.barcode.value,
        shelvingLocation: form.shelvingLocation.value || undefined,
        callNumber: form.callNumber.value || undefined,
      },
    }

    const ingresado = await ingresoMark21(registro)
    if (!ingresado) {
      console.error("Error en el ingreso del registro MARC21")
      return
    }

    formRef.current?.reset()
    setTipoItem("BK")
    setExito(true)
    setTimeout(() => setExito(false), 1200)
  }

  return (
    <>
      <div className="card pt-4 mt-4">
        <h2 className="mb-4 flex items-center gap-4 text-xl font-semibold">
            Ingresar libro
            <AnimatePresence>
            {exito && (
                <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="pt-1 pb-1.5 px-1.5 flex gap-1.5 items-center rounded text-greem bg-white"
                >
                <CheckIcon size={22} /> Registro ingresado exitosamente
                </motion.span>
            )}
            </AnimatePresence>
        </h2>

        <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Título: <span className="text-red">*</span></span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="titulo"
                    id="titulo"
                    required
                    minLength={2}
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Autor:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="autor"
                    id="autor"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Código de barras: <span className="text-red">*</span></span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="barcode"
                    id="barcode"
                    required
                    minLength={2}
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Tipo de ítem: <span className="text-red">*</span></span>
                <select
                    name="itemType"
                    id="itemType"
                    required
                    value={tipoItem}
                    onChange={(e) => setTipoItem(e.target.value as Marc21ItemType)}
                    className="w-full border bg-white border-black rounded p-1 px-2"
                >
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
                <select
                    name="literaryForm"
                    id="literaryForm"
                    defaultValue=""
                    className="w-full border bg-white border-black rounded p-1 px-2"
                >
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
                <span className="font-semibold">Edición:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="edition"
                    id="edition"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Lugar de publicación:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="placeOfPublication"
                    id="placeOfPublication"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Editorial:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="publisher"
                    id="publisher"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Año de publicación:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="publicationYear"
                    id="publicationYear"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Ubicación en estantería:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="shelvingLocation"
                    id="shelvingLocation"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span className="font-semibold">Signatura topográfica:</span>
                <input
                    onKeyDown={handleEnter}
                    type="text"
                    name="callNumber"
                    id="callNumber"
                    className="w-full border bg-white border-black rounded p-1 px-2"
                />
                </label>

                <label className="flex flex-col gap-1 text-base">
                <span>Biblioteca propietaria:</span>
                <input
                    type="text"
                    value={!homeBranch ? "El nombre se define en AJUSTES" : homeBranch}
                    disabled
                    name="homeBranch"
                    id="homeBranch"
                    required
                    className="w-full border bg-white border-black rounded p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                </label>
            </div>

            <input type="submit" value="Guardar registro" disabled={!homeBranch} className="px-4 py-2 btn mt-2" />
        </form>
      </div>
    </>
  )
}