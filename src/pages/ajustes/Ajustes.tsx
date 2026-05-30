import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { CopiarExcels } from "./CopiarExcels";
import { MaximoDiasDelPrestamo } from "./MaximoDiasDelPrestamo";
import { MaximoPrestamosForm } from "./MaximoPrestamosForm";
import { MaximoDeCuotasAdeudadas } from "./MaximoDeCuotasAdeudadas";

export function Ajustes() {
    const inicializar = useLibrosStore(s => s.inicializar)

    useEffect(() => { inicializar() }, [inicializar])

    return (
        <>
        <h2 className="pt-4 mb-4 text-xl font-semibold">Ajustes del sistema</h2>
        <div className="">
            <div className="flex flex-col gap-4">
                <MaximoPrestamosForm />
                <MaximoDiasDelPrestamo />
                <MaximoDeCuotasAdeudadas />
                <CopiarExcels />
            </div>
        </div>
        </>
    )
}
