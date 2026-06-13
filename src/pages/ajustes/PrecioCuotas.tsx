import { Form } from "@/components";
import { useSettingsStore } from "@/store";

export function PrecioCuota() {
    const { precioCuota, updateSetting } = useSettingsStore()

    const setPrice = (price: string) => {
        const newPrice = Number(price)
        if(newPrice <= 0) return
        updateSetting('precioCuota', newPrice)
    }

    return (
        <Form 
            label="Precio de la cuota:"
            placeholder=""
            defaultValue={precioCuota}
            inputType="number"
            onChange={setPrice}
            min={1}
            submitLabel="Establecer precio"
        />
    )
}
