import { CheckIcon, ChevronLeftIcon, LibroForm, Marc21Form, Spinner } from "@/components"
import { countryToPrefix, cutterFromAuthor, formatCountry, isMarc21, isValidNumeroInventario, makeBlankMark21, type Libro, type Marc21 } from "@shared/models"
import { useLibrosStore, useSettingsStore } from "@/store"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { formatName, formatTitulo } from "@/utils"
import { validateISBN } from "@shared/utils"

export function EditarLibro() {
  const { libroSeleccionado, editarLibro, verCatalogo } = useLibrosStore()
  const { nombreBiblioteca, estaDefinidoNombreBiblioteca, catalogacionSimple } = useSettingsStore()
  const homeBranch = estaDefinidoNombreBiblioteca() ? nombreBiblioteca : ''
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    if(!libroSeleccionado) return false
    if(loading) return false
    if(!form.titulo.value.trim()) return false

    const nro = form.numeroInventario ? form.numeroInventario.value : libroSeleccionado.numeroInventario
    const nroValido = isValidNumeroInventario(nro)
    if(!nroValido) return false

    let libro: Partial<Libro | Marc21> = {
      numeroInventario: nroValido ? nro : libroSeleccionado.numeroInventario,
      titulo: formatTitulo(form.titulo.value) || libroSeleccionado.titulo,
      autor: formatName(form.autor?.value) || libroSeleccionado.autor,
      literaryForm: form.literaryForm?.value || "u",
    }
    
    if(!catalogacionSimple) {
      const callNumber = form.callNumber?.value || `${countryToPrefix(form.callNumberPrefix?.value || "")} ${(form.dewey?.value || "").split(',').join('.')} ${cutterFromAuthor(form.autor?.value || "")}`
      const barcode = validateISBN(form.barcode?.value || "") ? form.barcode.value : ""
      libro = {
        ...libro,
        itemType: "BK",
        literaryForm: form.literaryForm?.value || "u",
        edition: form.edition?.value || "",
        placeOfPublication: formatName(form.placeOfPublication?.value || ""),
        publisher: formatName(form.publisher?.value || ""),
        publicationYear: form.publicationYear?.value || "",
        authorCountry: formatCountry(form.callNumberPrefix?.value || ""),
        dewey: parseFloat(form.dewey?.value || ""),
        holding: {
          homeBranch,
          holdingBranch: homeBranch,
          barcode,
          publicNote: formatTitulo(form.publicNote?.value || ""),
          callNumber: callNumber,
        },
      }
    }

    setLoading(true)
    const actualizado = await editarLibro(libro)
    setLoading(false)
    if (!actualizado) {
      console.error("Error en la edición del libro")
      return false
    }
    return true
  }

  if (!libroSeleccionado) {
    return (
      <div className="card">
        <p>No hay ningún libro seleccionado.</p>
      </div>
    )
  }

  return (
    <>
        <p
          className="w-70 mt-2 px-2 pt-1 pb-1.5 flex items-center gap-2 opacity-90 rounded bg-white/40 hover:bg-white transition-colors duration-75 ease-in cursor-pointer"
          onClick={() => !loading && verCatalogo()}
        >
          <ChevronLeftIcon />
          <span className="text-lg">Volver al catalogo de libros</span>
        </p>
      <div className="card pt-4 mt-4">
        <h2 className="mb-4 flex items-center gap-4 text-xl font-semibold">
            Editar libro
            { loading && <span className="ml-4"><Spinner /></span> }
            <AnimatePresence>
            {exito && (
                <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="pt-1 pb-1.5 px-1.5 flex gap-1.5 items-center rounded text-greem bg-white"
                >
                <CheckIcon size={22} /> Libro actualizado exitosamente
                </motion.span>
            )}
            </AnimatePresence>
        </h2>

        { isMarc21(libroSeleccionado) || !catalogacionSimple
          ? <Marc21Form 
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            mode="edicion"
            homeBranch={homeBranch}
            defaultValues={
              !isMarc21(libroSeleccionado) ? makeBlankMark21(libroSeleccionado) : libroSeleccionado
            }
            submitDisabled={loading}
            onSuccess={() => { setExito(true); setTimeout(() => setExito(false), 1200) }}
          /> 
          : <LibroForm
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            mode="edicion"
            defaultValues={libroSeleccionado}
            submitDisabled={loading}
            onSuccess={() => { setExito(true); setTimeout(() => setExito(false), 1200) }}
          />
        }
      </div>
    </>
  )
}