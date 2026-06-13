import { useSociosStore } from "@/store"
import { BuscadorSocios } from "./BuscadorSocios/BuscadorSocios"
import { DetalleSocio } from "./DetallesSocio/DetallesSocio"

export function Socios() {
  const {
    showDetallesSocio,
  } = useSociosStore()

  return (
    <>
      { showDetallesSocio
        ? <DetalleSocio />
        : <BuscadorSocios />
      }
    </>
  )
}
