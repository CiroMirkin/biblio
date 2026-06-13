import { Form } from "@/components";
import { useSettingsStore } from "@/store";

export function MaximoDiasDelPrestamo() {
    const { limiteDeDias, updateSetting } = useSettingsStore()

    const setMaximo = (max: string) => {
        const newMax = Number(max)
        if(newMax <= 0) return
        updateSetting('limiteDeDias', newMax)
    }

    return (
        <Form 
            label="Cantidad de días que un libro puede estar en préstamo:"
            placeholder=""
            defaultValue={limiteDeDias}
            inputType="number"
            onChange={setMaximo}
            min={1}
            submitLabel="Establecer días"
        />
    )
}
