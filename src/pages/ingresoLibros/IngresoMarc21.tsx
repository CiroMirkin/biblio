import { CheckIcon, Marc21Form, Spinner } from "@/components"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { countryToPrefix, cutterFromAuthor, isValidNumeroInventario, type Marc21 } from "@shared/models"
import { useLibrosStore, useSettingsStore } from "@/store"
import { formatName, formatTitulo } from "@/utils"
import { validateISBN } from "@shared/utils"

export function IngresoMarc21() {
  const { ingresoMark21 } = useLibrosStore()
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)
  const { nombreBiblioteca, estaDefinidoNombreBiblioteca, } = useSettingsStore()
  const { getUltimoNumeroInventario } = useLibrosStore()
  const homeBranch = estaDefinidoNombreBiblioteca() ? nombreBiblioteca : ''

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        if(loading) return;
        if(!form.titulo.value.trim()) return;
    
        let numeroInventario: string = form.numeroInventario.value.trim()
        if(!numeroInventario) {
          numeroInventario = String(getUltimoNumeroInventario() + 1)
        }
        if(!isValidNumeroInventario(numeroInventario)) return;

        const registro: Marc21 = {
            numeroInventario,
            titulo: formatTitulo(form.titulo.value),
            autor: formatName(form.autor.value) || undefined,
            itemType: "BK",
            literaryForm: form.literaryForm.value || undefined,
            edition: form.edition.value || undefined,
            placeOfPublication: form.placeOfPublication.value || undefined,
            publisher: form.publisher.value || undefined,
            publicationYear: form.publicationYear.value || undefined,
            authorCountry: formatTitulo(form.callNumberPrefix.value) || "",
            holding: {
                homeBranch,
                holdingBranch: homeBranch,
                barcode: validateISBN(form.barcode.value) ? form.barcode.value : "",
                publicNote: form.publicNote.value || "",
                callNumber: {
                    prefix: countryToPrefix(form.callNumberPrefix.value || ""),
                    dewey: String(form.callNumber.value || "").split(',').join('.'),
                    cutter: cutterFromAuthor(form.autor.value || ""),
                    volume: "",
                },
            },
        }

        setLoading(true)
        const ingresado = await ingresoMark21(registro)
        setLoading(false)
        if (!ingresado) {
            console.error("Error en el ingreso del registro MARC21")
            return false
        }

        setExito(true)
        setTimeout(() => setExito(false), 1200)
        return true
    }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4 mt-4">
      <div className="card pt-4">
        <h2 className="mb-4 flex items-center gap-4 text-xl font-semibold">
            Ingresar libro
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
                <CheckIcon size={22} /> Registro ingresado exitosamente
                </motion.span>
            )}
            </AnimatePresence>
        </h2>

        <Marc21Form
            onSubmit={handleSubmit}
            submitLabel="Ingresar Libro"
            mode="ingreso"
            homeBranch={nombreBiblioteca}
            submitDisabled={loading}
        />
      </div>
      <aside className="sticky top-0 h-fit hidden md:block">
        <div className="w-full bg-transparent h-2" />
        <section className="card mb-4 flex flex-col gap-2">
            { !homeBranch && <p className="font-semibold">El nombre de la biblioteca debe definirse dentro de ajustes.</p> }
            <p>Aquí puedes registrar nuevos libros.</p>
        </section>
      </aside>
    </div>
  )
}