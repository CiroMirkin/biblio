import { useState, type SyntheticEvent } from "react"

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
    bgColor: "bg-purple-100",
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
    <div className="h-full p-4 bg-white">
      <nav className="pt-4 flex justify-start gap-1">
        <button
          onClick={() => setActualView(options.CUOTA)}
          className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-secondary font-semibold"
        >Prestamo</button>
        <button onClick={() => setActualView(options.INSCRIPCION)} className="text-lg hover:underline py-3 pl-4 pr-6 rounded-t rounded-tr-2xl bg-purple-100">Inscripción</button>
      </nav>

      <main className={`p-4 rounded-b rounded-r ${bg}`}>
        { views.filter(view => view.id === actualView)[0].view }
      </main>
    </div>
  )
}

export default App

function Socios() {
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
        <form className="flex gap-2 rounded py-4 mb-4" onSubmit={handleSubmit}>

        <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellido del socio" />
        <input type="submit" value="Buscar" className="px-4 bg-[#fe8753] rounded" />

        </form>

      {lista && (
      <ul className="w-8/12 flex flex-col pt-2 pb-4">
        <li className="p-2 py-4 flex gap-2 justify-between bg-[#ffd396]">
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
        <li className="p-2 py-4 flex gap-2 justify-between bg-[#ffd396]">
          <span className="w-full text-lg">Mino Felipe</span>
          <button className="px-4 bg-[#fe8753] rounded">Seleccionar</button>
        </li>
      </ul>
    )}

    { cutoas && (
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded p-4">
            <h2 className="text-xl">Datos de <span className="font-semibold">Ciro Mirkin</span></h2>
            <ul className="pt-2 list-disc pl-6 text-sm">
              <li>DNI: 47668800</li>
              <li>Numero de celular: 354467894</li>
              <li>Dirección: Calle s/n</li>
              <li>Fecha de nacimiento: 03/06/2006</li>
              <li>Nacionalidad: Argentino</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 bg-white rounded p-4">
            <h2 className="text-xl font-semibold">Libros en Préstamo:</h2>

            <form className="w-full flex flex-col rounded">
              <div className="flex justify-between gap-2 rounded py-3 px-2 bg-gray-200">
                  <div className="text-lg flex gap-4">
                    <span>Llamadas telefónicas</span> 
                    <span>N° 19116</span>
                    </div>
                  <button className="px-4 bg-[#fe8753] rounded">Devuelto</button>
              </div>

              <div className="flex justify-between gap-2 rounded py-3 px-2 bg-white">
                  <div className="text-lg flex gap-4">
                    <span>La sed</span>
                    <span>N° 18869</span>
                  </div>
                  <button className="px-4 bg-[#fe8753] rounded">Devuelto</button>
              </div>

              <div className="flex gap-2 py-3 px-2 rounded bg-gray-200">
                  <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
                <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
              </div>

              <div className="flex gap-2 py-3 px-2 rounded bg-white">
                  <input type="text" name="" id=""  className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
                <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
              </div>

              <button className="bg-[#fe8753] mt-4 p-1 pb-2 text-lg rounded">Registrar préstamo</button>
            </form>
          </div>

          <div className="flex gap-4 bg-white rounded p-4">
            <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
            <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
          </div>
        </div>

        <div className="">
          <h2 className="text-xl mb-4">Cuotas:</h2>
          <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Enero</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Febrero</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Marzo</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Abril</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
            </li>
            <li className="px-3 pb-2 pt-1 rounded bg-green-300 flex flex-col gap-2 justify-center">
              <span className="font-semibold text-lg text-center">Mayo</span>
              <button className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
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