import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useSociosStore } from "../useSociosStore";
import { Spinner } from "@/components";

const PAGINA = 10

export function ListaSocios() {
  const { sociosFiltrados: socios, seleccionar } = useSociosStore()
  const [cantidad, setCantidad] = useState(PAGINA)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCantidad(PAGINA)
  }, [socios])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setCantidad(prev => Math.min(prev + PAGINA, socios.length))
      }
    })

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [socios.length])

  return (
    <ul className="w-full flex flex-col pb-4 mt-2">
      {socios.slice(0, cantidad).map((socio, index) => (
        <li
          key={`${socio.nroSocio}-${socio.nombreYApellido}`}
          className={cn(
            "px-4 py-4 flex gap-2 justify-between",
            index % 2 === 0 ? "bg-white" : "bg-white/50"
          )}
          onClick={() => seleccionar(socio)}
        >
          <span className="w-full text-lg">{socio.nombreYApellido}</span>
          <button className="btn">
            Ver
          </button>
        </li>
      ))}
      {cantidad < socios.length && (
        <div ref={loaderRef} className="py-4 flex items-center justify-center gap-1.5 text-sm text-gray-400">
          <Spinner /> Cargando ...
        </div>
      )}
    </ul>
  )
}
