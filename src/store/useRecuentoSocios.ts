import { useMemo } from "react"
import type { Socio } from "@shared/models"
import { getCaracterSocio } from "@/models"
import { useSociosStore } from "./useSociosStore"

export const contarSocios = (socios: Socio[]) => {
  const activos = socios.filter(s => {
    const caracter = getCaracterSocio(s.caracterSocio)
    return caracter.estado && !caracter.tieneCuotasDesactualizadas
  }).length

  return {
    activos,
    inactivos: socios.length - activos,
  }
}

export const useRecuentoSocios = () => {
  const socios = useSociosStore(s => s.socios)
  return useMemo(() => contarSocios(socios), [socios])
}
