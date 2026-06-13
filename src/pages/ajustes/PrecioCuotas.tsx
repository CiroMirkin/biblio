import { Form } from "@/components";
import { useSociosStore } from "@/store";

export function PrecioCuota() {
    const { precioCuota, setPrecioCuota } = useSociosStore()

    const setPrice = (price: string) => {
        const newPrice = Number(price)
        if(newPrice <= 0) return
        setPrecioCuota(newPrice)
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