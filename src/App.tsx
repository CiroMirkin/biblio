import { useState, type SyntheticEvent } from "react"

const options = {
  PRESTAMO: "Prestamo",
  CUOTA: "Cuotas",
  DEVOLUCION: "Devolución",
  INSCRIPCION: "Inscripción",
} as const;

type options = typeof options[keyof typeof options];

const views = [
  {
    id: options.PRESTAMO,
    view: <Prestamo />,
    bgColor: "bg-secondary",
  },
  {
    id: options.CUOTA,
    view: <Cuotas />,
    bgColor: "bg-sky-100",
  }, 
  {
    id: options.DEVOLUCION,
    view: <Devolucion />,
    bgColor: "bg-emerald-100",
  },
  {
    id: options.INSCRIPCION,
    view: <Inscripcion />,
    bgColor: "bg-purple-100",
  },
]

function App() {
  const [ actualView, setActualView ] = useState<options>(options.PRESTAMO)
  const [ bg, setbg ] = useState("bg-secondary")

  views.forEach(view => {
    if(view.id === actualView && bg !== view.bgColor) {
      setbg(view.bgColor)
    }
  })

  return (
    <div className="h-full p-8 bg-white">
      <nav className="pt-4 flex justify-start gap-1">
        <button
          onClick={() => setActualView(options.PRESTAMO)}
          className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary font-semibold"
        >Prestamo</button>
        <button onClick={() => setActualView(options.CUOTA)} className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-sky-100">Cuotas</button>
        <button onClick={() => setActualView(options.DEVOLUCION)} className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-emerald-100">Devolución</button>
        <button onClick={() => setActualView(options.INSCRIPCION)} className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-purple-100">Inscripción</button>
      </nav>

      <main className={`p-4 rounded-b rounded-r ${bg}`}>
        { views.filter(view => view.id === actualView)[0].view }
      </main>
    </div>
  )
}

export default App

function Prestamo() {
  const [ lista, setLista ] = useState(false)
  const [ libros, setLibros] = useState(false)

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    setLista(true)
    setLibros(false)
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Préstamo de libros</h2>
      <form className="flex gap-2 rounded py-4" onSubmit={handleSubmit}>
          <input type="text" name="Apellido del socio" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
          <input type="submit" value="Buscar" className="px-4 bg-[#fe8753] rounded" />
      </form>

    {lista && (
      <ul className="w-8/12 flex flex-col pt-2 pb-4">
        <li className="p-2 py-4 flex gap-2 justify-between bg-[#ffd396]">
          <span className="w-full text-lg">Mirkin Ciro</span>
          <button className="px-4 bg-[#fe8753] rounded" onClick={() => {
            setLista(false)
            setLibros(true)
          }}>Seleccionar</button>
        </li>
        <li className="p-2 py-4 flex gap-2 justify-between">
          <span className="w-full text-lg">Mirkin Gustavo</span>
          <button className="px-4 bg-[#fe8753] rounded">Seleccionar</button>
        </li>
        <li className="p-2 py-4 flex gap-2 justify-between bg-[#ffd396]">
          <span className="w-full text-lg">Mino Felipe</span>
          <button className="px-4 bg-[#fe8753] rounded">Seleccionar</button>
        </li>
      </ul>
    )}

        { libros && (
          <>
          <div className="flex gap-2 justify-between">
            <span className="w-full text-xl">Mirkin Ciro</span>
          </div>
          <form className="flex flex-col gap-2 rounded py-4">
          
          <div className="flex gap-2 p-4 rounded bg-white">
              <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
            <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
          </div>

          <div className="flex gap-2 p-4 rounded bg-white">
              <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
            <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
          </div>

          <div className="flex gap-2 p-4 rounded bg-white">
              <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
            <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
          </div>

          <div className="flex gap-2 p-4 rounded bg-white">
              <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
            <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
          </div>

          <button className="bg-[#fe8753] mt-4 p-1 py-2 text-lg hover:bg-white">Registrar préstamo</button>
        </form>
          </>
        )}
    </>
  )
}

function Cuotas() {
  const [ lista, setLista ] = useState(false)
  const [ cutoas, setCuotas] = useState(false)

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    setLista(true)
    setCuotas(false)
  }
  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Gestión de cuotas y socios</h2>
        <form className="flex gap-2 rounded py-4" onSubmit={handleSubmit}>

        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
        <input type="submit" value="Buscar" className="px-4 bg-[#fe8753] rounded" />

        </form>

      {lista && (
      <ul className="w-8/12 flex flex-col pt-2 pb-4">
        <li className="p-2 py-4 flex gap-2 justify-between bg-sky-300">
          <span className="w-full text-lg">Mirkin Ciro</span>
          <button className="px-4 bg-[#fe8753] rounded" onClick={() => {
            setLista(false)
            setCuotas(true)
          }}>Seleccionar</button>
        </li>
        <li className="p-2 py-4 flex gap-2 justify-between">
          <span className="w-full text-lg">Mirkin Gustavo</span>
          <button className="px-4 bg-[#fe8753] rounded">Seleccionar</button>
        </li>
        <li className="p-2 py-4 flex gap-2 justify-between bg-sky-300">
          <span className="w-full text-lg">Mino Felipe</span>
          <button className="px-4 bg-[#fe8753] rounded">Seleccionar</button>
        </li>
      </ul>
    )}

    { cutoas && (
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded p-4">
            <h2 className="text-xl">Datos de <span className="font-semibold">Ciro Mirkin</span></h2>
            <ul className="pt-2 list-disc pl-6">
              <li>DNI: </li>
              <li>Numero de celular: </li>
              <li>Dirección: </li>
              <li>Fecha de nacimiento: </li>
              <li>Nacionalidad: </li>
            </ul>
          </div>

          <div className="flex gap-4 bg-white rounded p-4">
            <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
            <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
          </div>
        </div>

        <div className="">
          <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Enero</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Febrero</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Marzo</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Abril</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Mayo</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Junio</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Julio</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Agosto</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Septiembre</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Octubre</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Noviembre</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-white flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Diciembre</span>
              <button className="px-4 pb-1 bg-[#fe8753] rounded">No Pago</button>
            </li>
          </ul>
        </div>
      </div>
    )}
    </>
  )
}

function Devolucion() {
  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Devolución de un libro</h2>
        <form className="flex gap-2 rounded py-4">

        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
        <input type="submit" value="Buscar" className="px-4 bg-[#fe8753] rounded" />
        </form>
    </>
  )
}

function Inscripcion() {

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()


  }

  return (
    <>
      <h2 className="mb-2 text-xl font-semibold">Inscripción de un nuevo socio</h2>
        <form className="flex gap-2 rounded py-4" onSubmit={handleSubmit}>

        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
        <input type="submit" value="Buscar" className="px-4 bg-[#fe8753] rounded" />

        </form>
    </>
  )
}