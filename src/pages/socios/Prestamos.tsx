
export function Prestamos() {
    return (
        <form className="w-full flex flex-col rounded">
            <div className="flex justify-between gap-2 rounded py-3 px-2 bg-gray-200">
              <div className="text-lg flex gap-4">
                <span>Llamadas telefónicas</span>
                <span>N° 19116</span>
              </div>
              <button className="btn">Devuelto</button>
            </div>
            <div className="flex justify-between gap-2 rounded py-3 px-2 bg-white">
              <div className="text-lg flex gap-4">
                <span>La sed</span>
                <span>N° 18869</span>
              </div>
              <button className="btn">Devuelto</button>
            </div>
            <div className="flex gap-2 py-3 px-2 rounded bg-gray-200">
              <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
              <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
            </div>
            <div className="flex gap-2 py-3 px-2 rounded bg-white">
              <input type="text" name="" id="" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
              <input type="text" name="" id="" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
            </div>
            <button className="bg-[#8cbfb3] mt-4 p-1 pb-2 text-lg rounded">Registrar préstamo</button>
        </form>
    )
}