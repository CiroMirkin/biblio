import { useState } from "react"
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
    <div className="h-full p-4 bg-white flex flex-col">
      <nav className="pt-4 flex justify-start items-end gap-1">
        <button
          onClick={() => setActualView(options.CUOTA)}
          className={cn(
            "h-14 text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary font-semibold transition-all duration-100",
            actualView === options.CUOTA && "font-bold h-18"
          )}
        >
          Prestamo
        </button>
        <button
          onClick={() => setActualView(options.INSCRIPCION)}
          className={cn(
            "h-14 text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-[#cadbf0]",
            actualView === options.INSCRIPCION && "font-bold h-18"
          )}
        >
          Inscripción
        </button>
      </nav>

      <main className={cn("p-4 rounded-b rounded-r flex-1", bg)}>
        { views.filter(view => view.id === actualView)[0].view }
      </main>
    </div>
  )
}

export default App
