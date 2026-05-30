import { CheckIcon, Form } from "@/components"
import { useSociosStore } from "@/store"

export function Observaciones() {
    const { socioSeleccionado, setObservaciones } = useSociosStore()
    const observaciones = socioSeleccionado?.observaciones

    return (
        <Form 
            textarea
            label="Observaciones:"
            defaultValue={observaciones}
            inputType="text"
            min={1}
            classNameInput="border-black/35"
            submitLabel={<CheckIcon size={20} />}
            classNameBtn="self-end py-2 px-2 w-10 flex justify-center items-center"
            onSubmit={setObservaciones}
            onChange={() => {}}
        />
    )
}