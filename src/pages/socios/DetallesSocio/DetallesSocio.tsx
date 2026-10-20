import { useSettingsStore, useVistaStore, useSocioSeleccionado } from "@/store"
import { Prestamos } from "./Prestamos/Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { Datos as SocioDatos } from "./Datos"
import { GestionEstadoSocio } from "./GestionEstadoSocio"
import { Observaciones } from "./Observaciones"
import { ChevronLeftIcon } from "@/components"
import { CheckExito } from "./CheckExito"
import { useState } from "react"
import { getCaracterSocio } from "@/models"
import { motion, AnimatePresence } from "motion/react"
import { SociosVinculados } from "./SociosVinculados/SociosVinculados"
import { ExplicacionSocioInactivo } from "./ExplicacionSocioInactivo"
import { HistorialPrestamos } from "./HistorialPrestamos"

export function DetalleSocio() {
  const { verListaSocios } = useVistaStore()
  const socioSeleccionado = useSocioSeleccionado()
  const { gestionDeCuotas, vincularSocios } = useSettingsStore()

  const [exito, setExito] = useState(false)

  const caracterSocio = getCaracterSocio(socioSeleccionado?.caracterSocio)

  return (
    <>
      <p
        className="w-70 mt-2 px-2 pt-1 pb-1.5 flex items-center gap-2 opacity-90 rounded bg-white/40 hover:bg-white transition-colors duration-75 ease-in cursor-pointer"
        onClick={verListaSocios}
      >
        <ChevronLeftIcon />
        <span className="text-lg">Volver a la lista de socios</span>
      </p>

      <div className="pt-4 grid grid-cols-1 md:grid-cols-[3.2fr_1.8fr] gap-4">
        <div className="flex flex-col gap-4">
          <SocioDatos />

          <div className="flex flex-col gap-4 card shadow-lg mr-2.5">
            <div className="w-full flex justify-between items-center">
              <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
              <CheckExito exito={exito} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${socioSeleccionado?.nroSocio}-${socioSeleccionado?.nombreYApellido}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <Prestamos onSuccess={() => {
                  setExito(true)
                  setTimeout(() => setExito(false), 3000)
                }} />
              </motion.div>
            </AnimatePresence>
          </div>
          
          { !caracterSocio.estado && <ExplicacionSocioInactivo /> }
          { !caracterSocio.estado && <Observaciones /> }
          
          { vincularSocios && <SociosVinculados /> }
          <HistorialPrestamos key={socioSeleccionado?.nroSocio} />
        </div>

        <div className="flex flex-col gap-4">
          { gestionDeCuotas
            ? <CalendarioCuotas />
            : <div className="card hidden md:block">Aqui estan los datos del socio y sus prestamos registrados.</div>
          }

          { caracterSocio.estado && <Observaciones /> }
          
          { caracterSocio.estado && 
            <div className="flex gap-4 card">
              <GestionEstadoSocio />
            </div>
          }
        </div>
      </div>
    </>
  )
}
