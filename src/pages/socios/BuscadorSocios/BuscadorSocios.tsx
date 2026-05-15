import { BuscarSocioForm } from "./BuscarSocioForm"
import { ListaSocios } from "./ListaSocios"
import { useSociosStore } from "../useSociosStore"

export function BuscadorSocios() {
  const { cuotas, sociosFiltrados, buscar, seleccionar } = useSociosStore()

  return (
    <div className="">
      <main className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 rounded bg-white/60 transition-colors duration-100">
        <div>
          <BuscarSocioForm onSearch={buscar} />
          {!cuotas && <ListaSocios socios={sociosFiltrados} onSelect={seleccionar} />}
        </div>
        {!cuotas && (
          <aside className="p-4 sticky h-auto rounded bg-white text-base">
            <p>Dentro de esta sección puedes:</p>
            <ul className="pl-4 pt-1 ml-1 list-disc">
              <li>Buscar socios según su apellido,</li>
              <li>ver sus datos personales</li>
              <li>el estado de sus cuotas,</li>
              <li>el préstamo y devolución de libros,</li>
              <li>darlo de baja o reincribirlo.</li>
            </ul>
          </aside>
        )}
      </main>
    </div>
  )
}