import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Inscripcion, Socios, Catalogo, Ajustes } from "@/pages";
import { cn } from "./utils";
import { ZoomControl } from "./components";
import { useSociosStore, useLibrosStore, useSettingsStore } from "./store";

const options = {
  CUOTA: "Socios",
  INSCRIPCION: "Inscripción",
  LIBROS: "Catalogo",
  AJUSTES: "Ajustes",
} as const;

type options = typeof options[keyof typeof options];

const views = [
  {
    id: options.CUOTA,
    view: <Socios />,
    bgColor: "bg-secondary",
  }, 
  {
    id: options.INSCRIPCION,
    view: <Inscripcion />,
    bgColor: "bg-[#a3c2f3]",
  },
  {
    id: options.LIBROS,
    view: <Catalogo />,
    bgColor: "bg-[#a36a96]",
  },
  {
    id: options.AJUSTES,
    view: <Ajustes />,
    bgColor: "bg-[#b6d4d4]",
  },
]

function App() {
  const { showListaSocios, buscar, inicializar: inicializarSocios } = useSociosStore()
  const { inicializar: inicializarLibros } = useLibrosStore()
  const { inicializar: inicializarSettings } = useSettingsStore()

  const [ actualView, setActualView ] = useState<options>(options.CUOTA)
  const [ bg, setbg ] = useState("bg-secondary")

  useEffect(() => {
    inicializarSettings().then(() => {
      inicializarSocios().catch(console.error)
      inicializarLibros().catch(console.error)
    })
  }, [])

  views.forEach(view => {
    if(view.id === actualView && bg !== view.bgColor) {
      setbg(view.bgColor)
    }
  })

  return (
    <div className="h-full bg-white flex flex-col scroll-smooth tracking-wide">
      <nav className="h-18 flex justify-start items-end gap-1">
        <motion.button
          onClick={() => {
            setActualView(options.CUOTA)
            showListaSocios()
            buscar("")
          }}
          animate={{ height: actualView === options.CUOTA ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary transition-colors duration-75 ease-in",
            actualView === options.CUOTA && "font-semibold",
            actualView !== options.CUOTA && "opacity-80",
          )}
        >
          <span className="hidden md:block">Socios y cuotas</span>
          <span className="block md:hidden">Socios</span>
        </motion.button>
        <motion.button
          onClick={() => setActualView(options.INSCRIPCION)}
          animate={{ height: actualView === options.INSCRIPCION ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg tracking-wider hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#a3c2f3] transition-colors duration-75 ease-in",
            actualView === options.INSCRIPCION && "font-semibold",
            actualView !== options.INSCRIPCION && "opacity-80"
          )}
        >
          Inscripción
        </motion.button>
        <motion.button
          onClick={() => setActualView(options.LIBROS)}
          animate={{ height: actualView === options.LIBROS ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#e856c6cb] transition-colors duration-75 ease-in",
            actualView === options.LIBROS && "font-semibold",
            actualView !== options.LIBROS && "opacity-80",
          )}
        >
          Catalogo
        </motion.button>
        <motion.button
          onClick={() => setActualView(options.AJUSTES)}
          animate={{ height: actualView === options.AJUSTES ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:opacity-100 py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#b6d4d4] transition-colors duration-75 ease-in",
            actualView === options.AJUSTES && "font-semibold",
            actualView !== options.AJUSTES && "opacity-80",
          )}
        >
          Ajustes
        </motion.button>

        <ZoomControl />
      </nav>

      <main className={cn("p-4 pt-0 rounded-b rounded-r flex-1 overflow-y-auto scroll_custom", bg)}>
        { views.filter(view => view.id === actualView)[0].view }
      </main>
    </div>
  )
}

export default App
