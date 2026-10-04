import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useLibrosStore, useSociosFiltrados, useSociosStore, useVistaStore } from "@/store"
import { Spinner } from "@/components";

const PAGINA = 10

export function ListaSocios() {
  const { loadingSocios } = useSociosStore()
  const { loadingLibros } = useLibrosStore()
  const { filtrados: sociosFiltrados } = useSociosFiltrados()
  const { verSocio } = useVistaStore()
  const [cantidad, setCantidad] = useState(PAGINA)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCantidad(PAGINA)
  }, [sociosFiltrados])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setCantidad(prev => Math.min(prev + PAGINA, sociosFiltrados.length))
      }
    })

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [sociosFiltrados.length])

  // sin los libros cargados aun no se sabe que socios tienen prestamos
  if(loadingSocios || loadingLibros) {
    return <div className="flex gap-2 items-center text-lg">
      <Spinner  /> Cargando...
    </div>
  }

  if(!sociosFiltrados.length) {
    return <p className="tracking-wide text-lg">No se encontraron coincidencias, verifica el nombre o el apellido escrito.</p>
  }
  
  return (
    <ul className="w-full flex flex-col pb-4 mt-2">
      {sociosFiltrados.slice(0, cantidad).map((socio, index) => (
        <li
          key={`${socio.nroSocio}-${socio.nombreYApellido}`}
          className={cn(
            "px-4 py-4 flex gap-2 justify-between hover:pl-6 border-l-2 border-transparent hover:border-l-black transition-all ease-in duration-100",
            index % 2 === 0 ? "bg-white" : "bg-white/50"
          )}
          onClick={() => verSocio(socio.nroSocio)}
        >
          <span className="w-full text-lg cursor-default select-none">{socio.nombreYApellido}</span>
          <button className="btn">
            Ver
          </button>
        </li>
      ))}
      {cantidad < sociosFiltrados.length && (
        <div ref={loaderRef} className="py-4 flex items-center justify-center gap-1.5 text-sm text-gray-400">
          <Spinner /> Cargando ...
        </div>
      )}
    </ul>
  )
}
