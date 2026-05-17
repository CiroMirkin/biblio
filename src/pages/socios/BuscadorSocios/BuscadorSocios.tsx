import { BuscarSocioForm } from "./BuscarSocioForm"
import { ListaSocios } from "./ListaSocios"
import { useSociosStore } from "@/store"
import { cn } from "@/utils"

export function BuscadorSocios() {
  const { cuotas } = useSociosStore()

  return (
    <main className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4">
      <div>
        <div className={cn(
          "sticky inset-y-0 z-50 rounded transition-colors duration-100",
          !cuotas ? "bg-white" : "bg-white/70 hover:bg-white"
        )}>
          <div className="h-4 w-full bg-secondary" />
          <BuscarSocioForm />
        </div>
        {!cuotas && <ListaSocios />}
      </div>
      {!cuotas && (
        <aside className="sticky top-0 h-fit">
          <div className="h-4 w-full bg-secondary" />
          <section className="p-4 rounded bg-white text-base">
            <p>Dentro de esta sección puedes:</p>
            <ul className="pl-4 pt-1 ml-1 list-disc">
              <li>Buscar socios según su apellido,</li>
              <li>ver sus datos personales</li>
              <li>el estado de sus cuotas,</li>
              <li>el préstamo y devolución de libros,</li>
              <li>darlo de baja o reincribirlo.</li>
            </ul>
          </section>
        </aside>
      )}
    </main>
  )
}