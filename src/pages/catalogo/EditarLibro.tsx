import { CheckIcon, ChevronLeftIcon, LibroForm, Marc21Form, Spinner } from "@/components"
import { isValidNumeroInventario, tieneDatosMarc } from "@shared/models"
import { libroDesdeLibroForm, type CamposForm } from "@/components/libroDesdeLibroForm"
import { libroDesdeMarc21Form } from "@/components/libroDesdeMarc21Form"
import { useLibroSeleccionado, useLibrosStore, useSettingsStore, useVistaStore } from "@/store"
import { useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"

export function EditarLibro() {
  const libroSeleccionado = useLibroSeleccionado()
  const { editarLibro } = useLibrosStore()
  const { verCatalogo, verEditarLibro } = useVistaStore()
  const { catalogacionSimple } = useSettingsStore()
  const usaMarc = tieneDatosMarc(libroSeleccionado) || !catalogacionSimple
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

    const campos = Object.fromEntries(new FormData(form)) as CamposForm
    const datos = usaMarc
      ? libroDesdeMarc21Form(campos, libroSeleccionado)
      : libroDesdeLibroForm(campos, libroSeleccionado)
    const libro = { ...datos, numeroInventario: nro }

    setLoading(true)
    const actualizado = await editarLibro(libroSeleccionado.numeroInventario, libro)
    setLoading(false)
    if (!actualizado) {
      console.error("Error en la edición del libro")
      return false
    }
    verEditarLibro(actualizado.numeroInventario)
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

        { usaMarc
          ? <Marc21Form 
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            mode="edicion"
            defaultValues={libroSeleccionado}
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