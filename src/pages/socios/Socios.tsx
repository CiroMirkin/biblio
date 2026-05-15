import { useEffect } from "react"
import { useSociosStore } from "./useSociosStore"
import { BuscadorSocios } from "./BuscadorSocios/BuscadorSocios"
import { DetalleSocio } from "./DetallesSocio/DetallesSocio"

export function Socios() {
  const {
    inicializar,
  } = useSociosStore()

  useEffect(() => {
    inicializar().catch(console.error)
  }, [])

  return (
    <>
      <BuscadorSocios />
      <DetalleSocio />
    </>
  )
}