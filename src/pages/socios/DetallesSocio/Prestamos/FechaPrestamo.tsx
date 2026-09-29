import { type LibroEnPrestamo } from "@shared/models"
import { calcularDiasDesdePrestamo, cn, formatFecha, getDia } from "@/utils"
import { useSettingsStore } from "@/store"
import { colFecha } from "./types"

interface Props {
  fechaDePrestamo: LibroEnPrestamo['fechaDePrestamo']
}

export function FechaPrestamo({ fechaDePrestamo }: Props) {
  const { limiteDeDias } = useSettingsStore()
  const dias = calcularDiasDesdePrestamo(fechaDePrestamo!)
  const vencido = dias > limiteDeDias

  return (
    <span
      className={cn(
        "text-lg", colFecha,
        vencido && "bg-[#f582ae59] px-1.5! self-center rounded"
      )}
      title={`${ getDia(fechaDePrestamo) } hace ${ dias } dias`}
      data-vencido={vencido}
    >
      {formatFecha(fechaDePrestamo)}
    </span>
  )
}
