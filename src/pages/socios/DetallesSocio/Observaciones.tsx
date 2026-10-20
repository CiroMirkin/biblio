import { CheckIcon, Form } from "@/components"
import { useSociosStore, useSocioSeleccionado } from "@/store"

export function Observaciones() {
    const { setObservaciones } = useSociosStore()
    const socioSeleccionado = useSocioSeleccionado()
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
            className="rounded p-4 card"
            classNameBtn="self-end py-2 px-2 w-10 flex justify-center items-center"
            onSubmit={(valor) => socioSeleccionado && setObservaciones(socioSeleccionado.nroSocio, valor)}
            onChange={() => {}}
        />
    )
}