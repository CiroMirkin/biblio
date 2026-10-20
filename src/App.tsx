import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Inscripcion, Socios, Catalogo, Ajustes, IngresoLibros } from "@/pages";
import { cn } from "./utils";
import { ZoomControl } from "./components";
import { useSociosStore, useLibrosStore, useSettingsStore, useVistaStore, type Vista } from "./store";

const options = {
  SOCIOS: "socios",
  INSCRIPCION: "inscripcion",
  LIBROS: "catalogo",
  INGRESO_LIBROS: "ingreso",
  AJUSTES: "ajustes",
} as const satisfies Record<string, Vista>;


const views = [
  {
    id: options.SOCIOS,
    view: () => <Socios />,
    bgColor: "bg-secondary",
  },
  {
    id: options.INSCRIPCION,
    view: () => <Inscripcion />,
    bgColor: "bg-[#a3c2f3]",
  },
  {
    id: options.LIBROS,
    view: () => <Catalogo />,
    bgColor: "bg-[#d26fb9c9]",
  },
  {
    id: options.INGRESO_LIBROS,
    view: () => <IngresoLibros />,
    bgColor: "bg-[#a1c690]",
  },
  {
    id: options.AJUSTES,
    view: () => <Ajustes />,
    bgColor: "bg-[#b6d4d4]",
  },
]

function App() {
  const { inicializar: inicializarSocios } = useSociosStore()
  const { inicializar: inicializarLibros } = useLibrosStore()
  const { vistaActual, ir } = useVistaStore()
  const { inicializar: inicializarSettings, numerosDeInventarioExternos, gestionDeCuotas } = useSettingsStore()

  const [ bg, setbg ] = useState("bg-secondary")

  useEffect(() => {
    inicializarSettings()
      .then(() => inicializarSocios())
      .then(() => inicializarLibros())
      .catch(console.error)
  }, [])

  views.forEach(view => {
    if(view.id === vistaActual && bg !== view.bgColor) {
      setbg(view.bgColor)
    }
  })

  return (
    <div className="h-full bg-white flex flex-col scroll-smooth tracking-wide">
      <nav className="h-18 flex justify-start items-end gap-1">
        <motion.button
          onClick={() => ir(options.SOCIOS)}
          animate={{ height: vistaActual === options.SOCIOS ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary transition-colors duration-75 ease-in",
            vistaActual === options.SOCIOS && "font-semibold",
            vistaActual !== options.SOCIOS && "opacity-80",
          )}
        >
          <span className="hidden md:block">{ gestionDeCuotas ? "Socios y cuotas" : "Socios" }</span>
          <span className="block md:hidden">Socios</span>
        </motion.button>

        <motion.button
          onClick={() => ir(options.INSCRIPCION)}
          animate={{ height: vistaActual === options.INSCRIPCION ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg tracking-wider hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#a3c2f3] transition-colors duration-75 ease-in",
            vistaActual === options.INSCRIPCION && "font-semibold",
            vistaActual !== options.INSCRIPCION && "opacity-80"
          )}
        >
          Inscripción
        </motion.button>

        <motion.button
          onClick={() => ir(options.LIBROS)}
          animate={{ height: vistaActual === options.LIBROS ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#d26fb9c9] transition-colors duration-75 ease-in",
            vistaActual === options.LIBROS && "font-semibold",
            vistaActual !== options.LIBROS && "opacity-80",
          )}
        >
          { numerosDeInventarioExternos ? "Catalogo" : "Prestamos" }
        </motion.button>

        <motion.button
          onClick={() => ir(options.INGRESO_LIBROS)}
          animate={{ height: vistaActual === options.INGRESO_LIBROS ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#a1c690] transition-colors duration-75 ease-in",
            vistaActual === options.INGRESO_LIBROS && "font-semibold",
            vistaActual !== options.INGRESO_LIBROS && "opacity-80",
            !numerosDeInventarioExternos && "hidden",
          )}
        >
          <span className="hidden md:block">Ingreso de libros</span>
          <span className="block md:hidden text-base min-w-20">Ing. Libros</span>
        </motion.button>

        <motion.button
          onClick={() => ir(options.AJUSTES)}
          animate={{ height: vistaActual === options.AJUSTES ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#b6d4d4] transition-colors duration-75 ease-in",
            vistaActual === options.AJUSTES && "font-semibold",
            vistaActual !== options.AJUSTES && "opacity-80",
          )}
        >
          Ajustes
        </motion.button>

        <ZoomControl />
      </nav>

      <main className={cn("p-4 pt-0 rounded-b rounded-r flex-1 overflow-y-auto scroll_custom", bg)}>
        { views.filter(view => view.id === vistaActual)[0].view() }
      </main>
    </div>
  )
}

export default App
