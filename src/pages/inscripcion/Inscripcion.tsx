import { CheckIcon } from "@/components"
import type { NewSocio } from "@shared/models"
import { useSociosStore } from "@/store"
import { useRef, useState } from "react"
import type { SyntheticEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { formatFecha, formatName } from "@/utils"
import { format } from "@formkit/tempo"
import { InscripcionForm } from "./InscripcionForm"

export function Inscripcion() {
  const { crearSocio } = useSociosStore()
  const formRef = useRef<HTMLFormElement>(null)
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const socio: NewSocio = {
      dni: Number(form.dni.value),
      nombreYApellido: `${formatName(form.apellidos.value)}, ${formatName(form.nombres.value)}`,
      fechaNacimiento: form.fechaNacimiento.value ? format(form.fechaNacimiento.value, "D/M/YYYY", "es") : null,
      fechaIngreso: formatFecha(new Date()),
      fechaEgreso: null,
      telefono: form.telefono.value,
      domicilio: form.domicilio.value || undefined,
      observaciones: form.observaciones.value || "",
      email: form.email.value || "",
      caracterSocio: "",
      sociosVinculados: [],
    }

    setLoading(true)
    const newSocio = await crearSocio(socio)
    setLoading(false)

    if (!newSocio) {
      console.error("Error en la creación del socio")
      return
    }

    formRef.current?.reset()
    setExito(true)
    setTimeout(() => setExito(false), 1200)
  }

  return (
    <>
      <h2 className="pt-4 mb-2 flex items-center gap-4 text-xl font-semibold">
        Inscripción de un nuevo socio
        <AnimatePresence>
          {exito && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="pt-1 pb-1.5 px-1.5 flex gap-1.5 items-center rounded text-greem bg-white"
            >
              <CheckIcon size={22} /> Socio creado exitosamente
            </motion.span>
          )}
        </AnimatePresence>
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4 mt-4">
        <InscripcionForm formRef={formRef} onSubmit={handleSubmit} loading={loading} success={exito} />

        <aside className="sticky top-0 h-fit hidden md:block">
          <section className="p-4 rounded bg-white text-base">
            <p>El apellido, nombre y numero de celular son los únicos datos 100% necesarios.</p>
          </section>
        </aside>
      </div>
    </>
  )
}