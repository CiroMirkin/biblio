import { useVistaStore } from "@/store"
import { BuscadorSocios } from "./BuscadorSocios/BuscadorSocios"
import { DetalleSocio } from "./DetallesSocio/DetallesSocio"

export function Socios() {
  const vista = useVistaStore(s => s.socios)

  return (
    <>
      { vista.modo === "detalle"
        ? <DetalleSocio />
        : <BuscadorSocios />
      }
    </>
  )
}
