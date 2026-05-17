import { Form } from "@/components";
import { useLibrosStore } from "@/store";

export function MaximoPrestamosForm() {
    const { maximoLibrosEnPrestamo, setMaximoLibrosEnPrestamo } = useLibrosStore()

    const setMaximo = (max: string) => {
        const newMax = Number(max)
        if(newMax <= 0) return
        setMaximoLibrosEnPrestamo(newMax)
    }

    return (
        <Form 
            label="Cantidad maxima de libros en préstamo:"
            placeholder=""
            defaultValue={maximoLibrosEnPrestamo}
            inputType="number"
            onChange={setMaximo}
            submitLabel="Establecer"
        />
    )
}