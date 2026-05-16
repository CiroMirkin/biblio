import type { SyntheticEvent } from "react";

export function Inscripcion() {

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();


  };

  return (
    <>
      <h2 className="pt-4 mb-2 text-xl font-semibold">Inscripción de un nuevo socio</h2>
      <form className="flex flex-col gap-2 rounded py-4" onSubmit={handleSubmit}>

        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="DNI" />
        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido" />
        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Nombre" />
        <input type="date" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Fecha de nacimiento" />
        <input type="number" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Numero de celular" />
        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Dirección" />
        <input type="submit" value="Inscribir" className="px-4 py-2 bg-[#eef4fe] rounded" />

      </form>
    </>
  );
}
