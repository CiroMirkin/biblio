const meses = [
  { nombre: "Enero", pagado: true },
  { nombre: "Febrero", pagado: true },
  { nombre: "Marzo", pagado: true },
  { nombre: "Abril", pagado: true },
  { nombre: "Mayo", pagado: true },
  { nombre: "Junio", pagado: false },
  { nombre: "Julio", pagado: false },
  { nombre: "Agosto", pagado: false },
  { nombre: "Septiembre", pagado: false },
  { nombre: "Octubre", pagado: false },
  { nombre: "Noviembre", pagado: false },
  { nombre: "Diciembre", pagado: false },
]

type MesProps = {
  nombre: string
  pagado: boolean
}

function Mes({ nombre, pagado }: MesProps) {
  return (
    <li className={`px-3 pb-2 pt-1 rounded flex flex-col gap-2 justify-center ${pagado ? "bg-green-300" : "bg-gray-200"}`}>
      <span className="font-semibold text-lg text-center">{nombre}</span>
      {pagado
        ? <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
        : <button className="px-4 pb-1 bg-[#8cbfb3] rounded">No Pago</button>
      }
    </li>
  )
}

export function CalendarioCuotas() {
  return (
    <>
      <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
        {meses.map((mes) => (
          <Mes key={mes.nombre} nombre={mes.nombre} pagado={mes.pagado} />
        ))}
      </ul>

      <footer className="w-full pt-4 flex gap-6 justify-center">
        <button className="btn">2025</button>
        <button className="btn opacity-35">2027</button>
      </footer>
    </>
  )
}