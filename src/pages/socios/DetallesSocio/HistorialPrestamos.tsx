import { useState } from "react"
import { useHistorialStore, useSettingsStore, useSociosStore } from "@/store"
import { motion, AnimatePresence } from "motion/react"
import { Spinner } from "@/components"
import { cn, formatFecha } from "@/utils"
import { isMarc21 } from "@shared/models"

export function HistorialPrestamos() {
  const { socioSeleccionado } = useSociosStore()
  const { entriesConLibro, loading, error, buscarPorSocio } = useHistorialStore()
  const { numerosDeInventarioExternos, catalogacionSimple } = useSettingsStore()
  const [consultado, setConsultado] = useState(false)

  const handleConsultar = async () => {
    if (!socioSeleccionado?.nroSocio) return
    setConsultado(true)
    await buscarPorSocio(socioSeleccionado.nroSocio)
  }

  if(!numerosDeInventarioExternos) {
    return <></>
  }

  return (
    <div className="flex flex-col gap-4 card card-secondary w-full">
      <div className="flex justify-between items-center opacity-95">
        <h2 className="text-lg font-semibold">Historial de prestamos</h2>
        <button
          onClick={handleConsultar}
          disabled={loading || !socioSeleccionado?.nroSocio}
          className="btn py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Consultar historial
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6 flex justify-center items-center gap-1 opacity-70"
          >
            <Spinner /> Cargando historial...
          </motion.div>
        )}

        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-2 text-red-600"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && consultado && entriesConLibro.length === 0 && (
          <motion.div
            key="vacio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-2 opacity-70"
          >
            El historia aún esta vació.
          </motion.div>
        )}

        {!loading && !error && consultado && entriesConLibro.length > 0 && (
          <motion.div
            key="tabla"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <table className="w-full text-left table-fixed">
              <thead>
                  <tr className="opacity-70 text-sm">
                    <th className="pb-2 pr-4 w-16">Nro</th>
                    <th className="pb-2 pr-3 w-1/3">Titulo</th>
                    <th className="pb-2 pr-2 w-1/4">Autor</th>
                    { !catalogacionSimple && <th className="pb-2 px-2 truncate">Signatura</th> }
                    <th className="pb-2 px-2 w-20 truncate">Préstamo</th>
                    <th className="pb-2 pl-2 w-20 truncate">Devolución</th>
                  </tr>
              </thead>
              <tbody>
                {entriesConLibro.map(entry => (
                  <tr key={entry.idPrestamo} className="border-t border-black/10">
                    <td className="py-2 pr-4 truncate opacity-95">{entry.nroLibro}</td>
                    <td className="py-2 pr-3 truncate font-semibold">{entry.titulo}</td>
                    <td className="py-2 pr-2 truncate">{entry?.autor || ""}</td>
                    {!catalogacionSimple && 
                      <td className="py-2 px-2 opacity-95">
                        { isMarc21(entry) ? entry.holding?.callNumber : "" }
                      </td>
                    }
                    <td className="py-2 px-2">{formatFecha(entry.fechaPrestamo)}</td>
                    <td className={cn("py-2 pl-2", !entry.fechaDevolucion && "opacity-60 truncate")}>
                      { entry.fechaDevolucion
                        ? formatFecha(entry.fechaDevolucion)
                        : "Pendiente"
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
