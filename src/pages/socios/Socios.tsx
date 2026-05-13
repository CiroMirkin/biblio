import { useState, type SyntheticEvent } from "react";
import { ListaSocios } from "./ListaSocios";
import { Prestamos } from "./Prestamos";
import { CalendarioCuotas } from "./CalendarioCuotas";

export function Socios() {
  const [lista, setLista] = useState(false);
  const [cuotas, setCuotas] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setLista(true);
    setCuotas(false);
  };
  return (
    <>
      <div className="">
        <h2 className="mb-2 text-xl font-semibold">Gestión de cuotas y socios</h2>
        <main className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 pt-4">
          <div>
            <form className="flex gap-2 rounded pb-4 mb-2" onSubmit={handleSubmit}>
              <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
              <input type="submit" value="Buscar" className="btn" />
            </form>

            {lista && (
              <ListaSocios />
            )}
          </div>
          {!cuotas && <aside className="p-4 rounded bg-white text-base">
            <p>Dentro de esta sección puedes:</p>
            <ul className="pl-4 pt-1 ml-1 list-disc">
              <li>Buscar socios según su apellido,</li>
              <li>ver sus datos personales</li>
              <li>el estado de sus cuotas,</li>
              <li>el préstamo y devolución de libros,</li>
              <li>darlo de baja o reincribirlo.</li>
            </ul>
          </aside>}
        </main>
      </div>

      {cuotas && (
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-8">
            <div className="card">
              <h2 className="text-xl">Datos de <span className="font-semibold">Ciro Mirkin</span></h2>
              <ul className="pt-2 list-disc pl-6 text-sm">
                <li>DNI: 47668800</li>
                <li>Numero de celular: 354467894</li>
                <li>Dirección: Calle s/n</li>
                <li>Fecha de nacimiento: 03/06/2006</li>
                <li>Nacionalidad: Argentino</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 card">
              <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
              <Prestamos />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded">
              <h2 className="pb-4 text-xl">Cuotas 2026</h2>
              
              <CalendarioCuotas />
            </div>
            <div className="mt-2 flex gap-4 card">
              <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
              <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
