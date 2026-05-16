import { useState } from "react"
import { motion } from "motion/react"
import { Inscripcion, Socios } from "@/pages";
import { cn } from "./utils";

const options = {
  CUOTA: "Socios",
  INSCRIPCION: "Inscripción",
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
    bgColor: "bg-[#cadbf0]",
  },
]

function App() {
  const [ actualView, setActualView ] = useState<options>(options.CUOTA)
  const [ bg, setbg ] = useState("bg-secondary")

  views.forEach(view => {
    if(view.id === actualView && bg !== view.bgColor) {
      setbg(view.bgColor)
    }
  })

  return (
    <div className="h-full bg-white flex flex-col scroll-smooth">
      <nav className="h-18 flex justify-start items-end gap-1">
        <motion.button
          onClick={() => setActualView(options.CUOTA)}
          animate={{ height: actualView === options.CUOTA ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary",
            actualView === options.CUOTA && "font-semibold"
          )}
        >
          Socios y cuotas
        </motion.button>
        <motion.button
          onClick={() => setActualView(options.INSCRIPCION)}
          animate={{ height: actualView === options.INSCRIPCION ? 72 : 56 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#cadbf0]",
            actualView === options.INSCRIPCION && "font-semibold"
          )}
        >
          Inscripción
        </motion.button>
      </nav>

      <main className={cn("p-4 pt-0 rounded-b rounded-r flex-1 overflow-y-auto scroll_custom", bg)}>
        { views.filter(view => view.id === actualView)[0].view }
      </main>
    </div>
  )
}

export default App
