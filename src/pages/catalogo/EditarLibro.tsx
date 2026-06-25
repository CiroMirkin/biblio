import { CheckIcon, ChevronLeftIcon, LibroForm, Marc21Form } from "@/components"
import { countryToPrefix, cutterFromAuthor, isMarc21, type Libro, type Marc21 } from "@shared/models"
import { useLibrosStore, useSettingsStore } from "@/store"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { formatName, formatTitulo } from "@/utils"

export function EditarLibro() {
  const { libroSeleccionado, editarLibro, verCatalogo } = useLibrosStore()
  const { nombreBiblioteca, estaDefinidoNombreBiblioteca, } = useSettingsStore()
  const homeBranch = estaDefinidoNombreBiblioteca() ? nombreBiblioteca : ''
  const [exito, setExito] = useState(false)

  if (!libroSeleccionado) {
    return (
      <div className="card">
        <p>No hay ningún libro seleccionado.</p>
      </div>
    )
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const libroSimple: Partial<Libro> = {
      numeroInventario: Number(form.numeroInventario.value) || libroSeleccionado.numeroInventario,
      titulo: formatTitulo(form.titulo.value) || libroSeleccionado.titulo,
      autor: formatName(form.autor.value) || libroSeleccionado.autor,
    }

    const libroMarc: Partial<Marc21> = {
      numeroInventario: form.nro || "",
      titulo: formatTitulo(form.titulo.value),
      autor: formatName(form.autor.value) || "",
      itemType: form.itemType.value,
      literaryForm: form.literaryForm.value || undefined,
      edition: form.edition.value || undefined,
      placeOfPublication: form.placeOfPublication.value || undefined,
      publisher: form.publisher.value || undefined,
      publicationYear: form.publicationYear.value || undefined,
      authorCountry: form.callNumberPrefix.value || "",
      holding: {
        homeBranch,
        holdingBranch: homeBranch,
        barcode: form.barcode.value,
        publicNote: form.publicNote.value || "",
        callNumber: {
          prefix: countryToPrefix(form.callNumberPrefix.value || ""),
          dewey: form.callNumber.value || "",
          cutter: cutterFromAuthor(form.autor.value || ""),
          volume: "",
        },
      },
    }

    const actualizado = await editarLibro(isMarc21(libroSeleccionado) ? libroMarc : libroSimple)
    if (!actualizado) {
      console.error("Error en la edición del libro")
      return
    }

    setExito(true)
    setTimeout(() => setExito(false), 1200)
  }

  return (
    <>
        <p
          className="w-70 mt-2 px-2 pt-1 pb-1.5 flex items-center gap-2 opacity-90 rounded bg-white/40 hover:bg-white transition-colors duration-75 ease-in cursor-pointer"
          onClick={verCatalogo}
        >
          <ChevronLeftIcon />
          <span className="text-lg">Volver al catalogo de libros</span>
        </p>
      <div className="card pt-4 mt-4">
        <h2 className="mb-4 flex items-center gap-4 text-xl font-semibold">
            Editar libro
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

        { isMarc21(libroSeleccionado)
          ? <Marc21Form 
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            mode="edicion"
            homeBranch={homeBranch}
            defaultValues={libroSeleccionado}
          /> 
          : <LibroForm
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            mode="edicion"
            defaultValues={libroSeleccionado}
          />
        }
      </div>
    </>
  )
}