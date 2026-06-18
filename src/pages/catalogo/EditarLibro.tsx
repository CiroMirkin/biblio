import { CheckIcon, ChevronLeftIcon } from "@/components"
import type { Libro } from "@/models"
import { useLibrosStore } from "@/store"
import { useRef, useState } from "react"
import type { KeyboardEvent, SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"

const ORDER = ["numeroInventario", "titulo", "autor"]

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

export function EditarLibro() {
  const { libroSeleccionado, editarLibro, verCatalogo } = useLibrosStore()
  const formRef = useRef<HTMLFormElement>(null)
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
    const libro: Partial<Libro> = {
      numeroInventario: Number(form.numeroInventario.value) || libroSeleccionado.numeroInventario,
      titulo: form.titulo.value || libroSeleccionado.titulo,
      autor: form.autor.value || libroSeleccionado.autor,
    }

    const actualizado = await editarLibro(libro)
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

        <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-base">
            N° de inventario:
            <input
                onKeyDown={handleEnter}
                type="text"
                name="numeroInventario"
                id="numeroInventario"
                defaultValue={libroSeleccionado.numeroInventario}
                className="w-full border bg-white border-black rounded p-1 px-2"
                placeholder="N° de inventario"
            />
            </label>

            <label className="flex flex-col gap-1 text-base">
            Título:
            <input
                onKeyDown={handleEnter}
                type="text"
                name="titulo"
                id="titulo"
                defaultValue={libroSeleccionado.titulo}
                className="w-full border bg-white border-black rounded p-1 px-2"
                placeholder="Título"
            />
            </label>

            <label className="flex flex-col gap-1 text-base">
            Autor:
            <input
                onKeyDown={handleEnter}
                type="text"
                name="autor"
                id="autor"
                defaultValue={libroSeleccionado.autor}
                className="w-full border bg-white border-black rounded p-1 px-2"
                placeholder="Autor"
            />
            </label>

            <input type="submit" value="Guardar cambios" className="px-4 py-2 btn mt-2" />
        </form>
      </div>
    </>
  )
}