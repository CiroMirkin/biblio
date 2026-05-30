import { Form } from "@/components";
import { useSociosStore } from "@/store";

/** Establece la cantidad maxima de cuotas (meses) adeudadas, cuando se supera dicha cantidad  el socio se da de baja automáticamente. */
export function MaximoDeCuotasAdeudadas() {
    const { maximoDeCuotasAdeudadas, setMaximoDeCuotasAdeudadas} = useSociosStore()

    const setMaximo = (value: string) => {
        const newMax = Number(value)
        if(newMax <= 1) return
        setMaximoDeCuotasAdeudadas(newMax)
    }

    return (
        <Form 
            label="Cantidad de cuotas adeudadas necesarias para dar de baja a un socio automáticamente:"
            defaultValue={maximoDeCuotasAdeudadas}
            inputType="number"
            onChange={setMaximo}
            min={1}
            submitLabel="Establecer meses"
        />
    )
}