import { CheckIcon, Form } from "@/components";
import { useSettingsStore } from "@/store";

export function NombreBiblioteca() {
    const { nombreBiblioteca, updateSetting } = useSettingsStore()

    const setName = (name: string) => {
        const newName = name.trim()
        if(!newName.length) return
        updateSetting('nombreBiblioteca', newName)
    }

    return (
        <Form 
            label="Nombre de la biblioteca:"
            placeholder=""
            defaultValue={nombreBiblioteca}
            inputType="string"
            onChange={setName}
            min={3}
            submitLabel={<CheckIcon size={20} />}
            classNameBtn="self-end py-2 px-2 w-10 flex justify-center items-center"
        />
    )
}
