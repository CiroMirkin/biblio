import { useState } from "react"
import { useHistorialStore, useSettingsStore, useSociosStore } from "@/store"
import { motion, AnimatePresence } from "motion/react"
import { Spinner } from "@/components"
import { formatFecha } from "@/utils"

export function HistorialPrestamos() {
  const { socioSeleccionado } = useSociosStore()
  const { entriesConLibro, loading, error, buscarPorSocio } = useHistorialStore()
  const { numerosDeInventarioExternos } = useSettingsStore()
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
    <div className="flex flex-col gap-4 card shadow-lg mr-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Historial</h2>
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
            className="py-6 flex justify-center items-center opacity-70"
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
            className="py-4 text-red-600"
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
            className="py-4 opacity-70"
          >
            No se encontraron registros.
          </motion.div>
        )}

        {!loading && !error && entriesConLibro.length > 0 && (
          <motion.div
            key="tabla"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="opacity-70 text-sm">
                  <th className="pb-2">Nro</th>
                  <th className="pb-2">Titulo</th>
                  <th className="pb-2">Autor</th>
                  <th className="pb-2 truncate">Préstamo</th>
                  <th className="pb-2 truncate">Devolución</th>
                </tr>
              </thead>
              <tbody>
                {entriesConLibro.map(entry => (
                  <tr key={entry.idPrestamo} className="border-t border-black/10">
                    <td className="py-2 truncate">{entry.nroLibro}</td>
                    <td className="py-2">{entry.titulo}</td>
                    <td className="py-2 truncate">{entry?.autor || ""}</td>
                    <td className="py-2">{formatFecha(entry.fechaPrestamo)}</td>
                    <td className="py-2">
                      {entry.fechaDevolucion
                        ? formatFecha(entry.fechaDevolucion)
                        : <span className="opacity-60">Pendiente</span>}
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
