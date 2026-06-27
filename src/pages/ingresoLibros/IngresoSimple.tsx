import { CheckIcon, LibroForm } from "@/components"
import type { Libro } from "@shared/models"
import { useLibrosStore } from "@/store"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { formatName, formatTitulo } from "@/utils"

export function IngresoSimple() {
  const { ingresoSimple, getUltimoNumeroInventario } = useLibrosStore()
  const [exito, setExito] = useState(false)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    if(!form.titulo.value.trim()) return;
    
    let numeroInventario: string = form.numeroInventario.value.trim()
    if(!numeroInventario) {
      numeroInventario = String(getUltimoNumeroInventario() + 1)
    }

    const libro: Libro = {
      numeroInventario,
      titulo: formatTitulo(form.titulo.value),
      autor: formatName(form.autor.value) || "",
    }

    const actualizado = await ingresoSimple(libro)
    if (!actualizado) {
      console.error("Error en la edición del libro")
      return
    }

    setExito(true)
    setTimeout(() => setExito(false), 1200)
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4 mt-4">
      <div className="card pt-4">
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

        <LibroForm submitLabel="Ingresar Libro" onSubmit={handleSubmit} mode="ingreso" />
      </div>
      <aside className="sticky top-0 h-fit hidden md:block">
        <div className="w-full bg-transparent h-2" />
        <section className="card mb-4 flex flex-col gap-2">
          <p>Aquí puedes registrar nuevos libros</p>
        </section>
      </aside>
    </div>
  )
}