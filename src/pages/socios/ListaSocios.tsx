
export function ListaSocios(){
    return (
         <ul className="w-full flex flex-col pb-4">
            <li className="px-4 py-4 flex gap-2 justify-between bg-white">
                <span className="w-full text-lg">Mirkin Ciro</span>
                <button className="btn">Seleccionar</button>
            </li>
            <li className="px-4 py-4 flex gap-2 justify-between bg-white/50">
                <span className="w-full text-lg">Mirkin Gustavo</span>
                <button className="btn">Seleccionar</button>
            </li>
            <li className="px-4 py-4 flex gap-2 justify-between bg-white">
                <span className="w-full text-lg">Mino Felipe</span>
                <button className="btn">Seleccionar</button>
            </li>
        </ul>
    )
}