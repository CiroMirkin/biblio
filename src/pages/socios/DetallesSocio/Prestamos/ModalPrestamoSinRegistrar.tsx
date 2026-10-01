import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useSociosStore } from "@/store"

interface Props {
  onRegistrar: () => Promise<unknown>
}

export function ModalPrestamoSinRegistrar({ onRegistrar }: Props) {
  const { salidaPendiente, cancelarSalida } = useSociosStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const reducirMovimiento = useReducedMotion()

  useEffect(() => {
    if (salidaPendiente) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [salidaPendiente])

  function salir() {
    const accion = salidaPendiente
    cancelarSalida()
    accion?.()
  }

  async function registrar() {
    setLoading(true)
    await onRegistrar()
    setLoading(false)
    cancelarSalida()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={cancelarSalida}
      className="m-auto p-6 max-w-lg bg-transparent overflow-visible isolate backdrop:bg-black/55"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-white rounded shadow-sm"
        animate={salidaPendiente && !reducirMovimiento ? { scale: [1, 1.04, 0.98, 1.01, 1] } : { scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
      />
      <p className="text-xl pb-6"><span className="font-semibold">Los libros aún no se registraron como préstamo.</span> ¿Desea salir sin registrarlos?</p>
      <div className="flex justify-between gap-2">
        <button type="button" className="btn px-3 py-1 rounded" disabled={loading} onClick={registrar}>
          Registrar préstamo
        </button>
        <button type="button" className="btn-secondary px-3 py-1 rounded cursor-pointer" onClick={salir}>
          Abandonar sin registrar
        </button>
      </div>
    </dialog>
  )
}
