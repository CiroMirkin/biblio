import type { Socio } from "@/models/Socio";

interface ListaSociosProps {
  socios: Socio[];
  onSelect: (socio: Socio) => void;
}

export function ListaSocios({ socios, onSelect }: ListaSociosProps) {
  return (
    <ul className="w-full flex flex-col pb-4">
      {socios.map((socio, index) => (
        <li
          key={socio.nroSocio}
          className={`px-4 py-4 flex gap-2 justify-between ${index % 2 === 0 ? "bg-white" : "bg-white/50"}`}
        >
          <span className="w-full text-lg">{socio.nombreYApellido}</span>
          <button className="btn" onClick={() => onSelect(socio)}>
            Seleccionar
          </button>
        </li>
      ))}
    </ul>
  );
}
