import { CheckIcon, Marc21Form, Spinner } from "@/components"
import { libroDesdeMarc21Form } from "@/components/libroDesdeMarc21Form"
import { type CamposForm } from "@/components/libroDesdeLibroForm"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { holdingVacio, isValidNumeroInventario } from "@shared/models"
import { useLibrosStore, useSettingsStore } from "@/store"

export function IngresoMarc21() {
  const { ingresarLibro } = useLibrosStore()
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ nroInvalido, setNroComoInvalido ] = useState(false)
  const { nombreBiblioteca, estaDefinidoNombreBiblioteca, } = useSettingsStore()
  const { getUltimoNumeroInventario } = useLibrosStore()
  const homeBranch = estaDefinidoNombreBiblioteca() ? nombreBiblioteca : ''
  const nroParaLibroNuevo = String(getUltimoNumeroInventario() + 1)

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        if(loading) return false
        if(!form.titulo.value.trim()) return false
    
        let numeroInventario: string = form.numeroInventario.value.trim()
        if(!numeroInventario) {
          numeroInventario = nroParaLibroNuevo
        }
        if(!isValidNumeroInventario(numeroInventario)) {
          setNroComoInvalido(true)
          return false
        }

        const campos = Object.fromEntries(new FormData(form)) as CamposForm
        const registro = { ...libroDesdeMarc21Form(campos), numeroInventario }

        setLoading(true)
        const ingresado = await ingresarLibro(registro)
        setLoading(false)
        if (!ingresado) {
            console.error("Error en el ingreso del registro MARC21")
            return false
        }
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
            submitDisabled={loading || nroInvalido || !homeBranch}
            defaultValues={{ numeroInventario: nroParaLibroNuevo, titulo: "", itemType: "BK", holding: holdingVacio() }}
            onSuccess={() => { setExito(true); setTimeout(() => setExito(false), 1200) }}
        />
      </div>
      <aside className="sticky top-0 h-fit hidden md:block">
        <div className="w-full bg-transparent h-2" />
        <section className="card mb-4 flex flex-col gap-2">
            { !homeBranch && <p className="font-semibold">El nombre de la biblioteca debe definirse dentro de ajustes.</p> }
            <p>Aquí puedes registrar nuevos libros dentro del inventario, <strong>esta sección no es para registrar prestamos.</strong></p>
            { homeBranch && <p>El libro es propiedad de "{nombreBiblioteca}"</p> }
        </section>
      </aside>
    </div>
  )
}