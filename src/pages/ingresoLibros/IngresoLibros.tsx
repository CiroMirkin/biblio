import { useState } from "react"
import { IngresoSimple } from "./IngresoSimple"
import { IngresoMarc21 } from "./IngresoMarc21"

export function IngresoLibros() {
    const [ tipoDeIngreso, setTipoDeIngreso ] = useState('' as '' | 'simple' | 'marc21')
    return (
        <>
            { !tipoDeIngreso && <div className="card mt-4">
                <h2 className="text-xl font-semibold mb-4">Elige el formato de ingreso:</h2>
                <div className="flex gap-2">
                    <button className="btn" onClick={() => setTipoDeIngreso('simple')}>Registro simple del libro</button>
                    <button className="btn" onClick={() => setTipoDeIngreso('marc21')}>Registro del libro en MARC 21</button>
                </div>
            </div> }

            { tipoDeIngreso === 'simple' && <IngresoSimple comeBack={ () => setTipoDeIngreso('') } /> }
            { tipoDeIngreso === 'marc21' && <IngresoMarc21 comeBack={ () => setTipoDeIngreso('') } /> }
        </>
    )
}
