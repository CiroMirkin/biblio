import { useState } from "react"
import { SubmitButton } from "@/components"

interface Props {
  // devuelve true si se registró al menos un préstamo
  onRegistrar: () => Promise<boolean>
}

export function BotonRegistrarPrestamo({ onRegistrar }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleClick() {
    if (loading) return

    setLoading(true)
    const ok = await onRegistrar()
    setLoading(false)
    if (!ok) return

    setSuccess(true)
    setTimeout(() => setSuccess(false), 1500)
  }

  return (
    <SubmitButton
      onClick={handleClick}
      loading={loading}
      success={success}
      className="btn mt-4 p-1 pb-2 text-lg rounded"
      iconSize={24}
      iconClassName="pt-1 text-[#fff]"
    >
      Registrar préstamo
    </SubmitButton>
  )
}
