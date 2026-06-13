import { Form } from "@/components";
import { useSettingsStore } from "@/store";

export function MaximoPrestamosForm() {
    const { maximoLibrosEnPrestamo, updateSetting } = useSettingsStore()

    const setMaximo = (max: string) => {
        const newMax = Number(max)
        if(newMax <= 0) return
        updateSetting('maximoLibrosEnPrestamo', newMax)
    }

    return (
        <Form 
            label="Cantidad maxima de libros en préstamo:"
            placeholder=""
            defaultValue={maximoLibrosEnPrestamo}
            inputType="number"
            min={1}
            onChange={setMaximo}
            submitLabel="Establecer"
        />
    )
}
