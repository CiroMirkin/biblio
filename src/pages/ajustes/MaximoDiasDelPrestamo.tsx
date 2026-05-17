import { Form } from "@/components";
import { useLibrosStore } from "@/store";

export function MaximoDiasDelPrestamo() {
    const { limiteDeDias, setLimiteDeDias } = useLibrosStore()

    const setMaximo = (max: string) => {
        const newMax = Number(max)
        if(newMax <= 0) return
        setLimiteDeDias(newMax)
    }

    return (
        <Form 
            label="Cantidad de días que un libro puede estar en préstamo:"
            placeholder=""
            defaultValue={limiteDeDias}
            inputType="number"
            onChange={setMaximo}
            submitLabel="Establecer días"
        />
    )
}