import { CopiarExcels } from "./CopiarExcels";
import { MaximoDiasDelPrestamo } from "./MaximoDiasDelPrestamo";
import { MaximoPrestamosForm } from "./MaximoPrestamosForm";

export function Ajustes() {
    return (
        <>
        <h2 className="pt-4 mb-4 text-xl font-semibold">Ajustes del sistema</h2>
        <div className="">
            <div className="flex flex-col gap-4">
                <MaximoPrestamosForm />
                <MaximoDiasDelPrestamo />
                <CopiarExcels />
            </div>
        </div>
        </>
    )
}
