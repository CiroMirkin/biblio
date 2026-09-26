import { useEffect } from "react"
import { useHistorialStore, useLibrosStore } from "@/store"
import { ChevronLeftIcon, Spinner } from "@/components"
import { cn, formatFecha } from "@/utils"

export function HistorialLibro() {
  const { libroSeleccionado, verCatalogo } = useLibrosStore()
  const { entriesConSocio, loading, error, buscarPorLibro } = useHistorialStore()

  const nroInv = libroSeleccionado?.numeroInventario

  useEffect(() => {
    if (nroInv) buscarPorLibro(String(nroInv))
  }, [nroInv, buscarPorLibro])

  return (
    <>
      <p
        className="w-70 mt-2 px-2 pt-1 pb-1.5 flex items-center gap-2 opacity-90 rounded bg-white/40 hover:bg-white transition-colors duration-75 ease-in cursor-pointer"
        onClick={verCatalogo}
      >
        <ChevronLeftIcon />
        <span className="text-lg">Volver al catalogo de libros</span>
      </p>

      <div className="card pt-4 mt-4">
        <h2 className="text-xl font-semibold">Historial de prestamos</h2>
        <p className="mb-4 font-semibold pr-2 text-sm opacity-80">
          { libroSeleccionado?.titulo }
        </p>

        {loading && (
          <div className="py-6 flex justify-center items-center gap-1 opacity-70">
            <Spinner /> Cargando historial...
          </div>
        )}

        {!loading && error && (
          <div className="py-2 text-red-600">{error}</div>
        )}

        {!loading && !error && entriesConSocio.length === 0 && (
          <div className="py-2 opacity-70">El libro aún no tiene préstamos registrados.</div>
        )}

        {!loading && !error && entriesConSocio.length > 0 && (
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="opacity-70 text-sm">
                <th className="pb-2 pr-4 w-16">Socio</th>
                <th className="pb-2 pr-3">Nombre</th>
                <th className="pb-2 px-2 w-24 truncate">Préstamo</th>
                <th className="pb-2 pl-2 w-24 truncate">Devolución</th>
              </tr>
            </thead>
            <tbody>
              {entriesConSocio.map(entry => (
                <tr key={entry.idPrestamo} className="border-t border-black/10">
                  <td className="py-2 pr-4 truncate opacity-95">{entry.nroSocio}</td>
                  <td className="py-2 pr-3 truncate font-semibold">{entry.nombreYApellido ?? ""}</td>
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
        )}
      </div>
    </>
  )
}
