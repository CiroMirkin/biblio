import { Form, Spinner } from "@/components";
import { useSociosStore } from "@/store";
import { cn } from "@/utils";
import { useState } from "react";

/** Establece la cantidad maxima de cuotas (meses) adeudadas, cuando se supera dicha cantidad  el socio se da de baja automáticamente. */
export function MaximoDeCuotasAdeudadas() {
    const {
        maximoDeCuotasAdeudadas,
        setMaximoDeCuotasAdeudadas,
        actualizarCaracterSocios
    } = useSociosStore()
    const [loading, setLoading] = useState(false)
    

    const setMaximo = (value: string) => {
        const newMax = Number(value)
        if(newMax <= 1) return
        setMaximoDeCuotasAdeudadas(newMax)
    }

    const handleActualizacion = async () => {
        setLoading(true)
        await actualizarCaracterSocios()
        setLoading(false)
    }

    return (
        <section className="card">
            { /** se debe desactivar al estar loading */}
            <Form 
                label="Cantidad de cuotas adeudadas necesarias para dar de baja a un socio automáticamente:"
                defaultValue={maximoDeCuotasAdeudadas}
                inputType="number"
                onChange={setMaximo}
                min={1}
                submitLabel="Establecer meses"
            />
            <button
                onClick={handleActualizacion}
                disabled={loading}
                className={cn("btn", loading && "btn-disabled" )}
            >
                { loading 
                    ? (
                        <div className="flex items-center gap-1">
                            <Spinner /> <span>Actualizando...</span>
                        </div>
                    )
                    : <span>Actual el caracter de todos los socios</span>
                } 
            </button>
        </section>
    )
}