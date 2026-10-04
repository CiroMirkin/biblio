import { CheckIcon, Form, Spinner } from "@/components"
import type { Socio } from "@shared/models"
import { useSociosFiltrados, useSociosStore, useSocioSeleccionado, useSociosVinculados } from "@/store"
import { cn } from "@/utils"
import { useState } from "react"

export function VincularSocio() {
    const [nombre, setNombre] = useState('')
    const [ socioEnVinculacion, setSocioEnVinculacion ] = useState(null as null | number)
    const { buscar, vincularSocio } = useSociosStore()
    const { filtrados: sociosFiltrados } = useSociosFiltrados()
    const socioSeleccionado = useSocioSeleccionado()

    const handleSubmit = (value: string) => {
        if(socioEnVinculacion !== null) return;
        if(value.length < 3) return; 
        buscar(value)
    }
    
    const handleChange = (value: string) => {
        if(socioEnVinculacion !== null) return;
        if(value.length < 3) return; 

        setNombre(value)
        buscar(value)
    }

    const handleVinculacion = async (nroSocio: number) => {
        if(socioEnVinculacion !== null || !socioSeleccionado) return;

        setSocioEnVinculacion(nroSocio)
        await vincularSocio(socioSeleccionado.nroSocio, Number(nroSocio))
        setSocioEnVinculacion(null)
        buscar("")
        setNombre("")
    }

    return (
        <>
        <Form 
            label=""
            defaultValue={nombre}
            inputType="text"
            min={1}
            classNameInput="border-black/35"
            submitLabel={<CheckIcon size={20} />}
            className="rounded card border-none! p-0! placeholder:opacity-40"
            classNameBtn="hidden"
            onSubmit={handleSubmit}
            placeholder="Nombre del socio a vincular..."
            onChange={handleChange}
        />

        <div className="mt-2 flex flex-wrap gap-2.5">
            { sociosFiltrados.map(s => 
                <SocioBtn
                    socio={s}
                    socioEnVinculacion={socioEnVinculacion}
                    handleVinculacion={handleVinculacion}
                />
            )}
        </div>
        </>
    )
}

interface PropsBtn {
    socio: Socio,
    socioEnVinculacion: number | null
    handleVinculacion: (nro: number) => void
}

function SocioBtn({ socio, socioEnVinculacion, handleVinculacion }: PropsBtn) {
    const socioSeleccionado = useSocioSeleccionado()
    const sociosVinculados = useSociosVinculados()
    
    if(socio.nroSocio === socioSeleccionado!.nroSocio) return;
    
    const nroDeSociosYaVinculados = sociosVinculados.map(s => s.nroSocio)
    if(nroDeSociosYaVinculados.includes(socio.nroSocio)) return;
    
    const title = nroDeSociosYaVinculados.includes(socio.nroSocio)
        ? "Socio ya vinculado"
        : "Click para vincular"
    
    return (
        <button
            key={socio.nroSocio}
            onClick={() => handleVinculacion(socio.nroSocio)}
            className={cn(
                "btn-secondary",
            )}
            disabled={socioEnVinculacion !== null}
            title={title}
        >
            { socioEnVinculacion === socio.nroSocio && <span className="mr-2"><Spinner/></span> }
            { socio.nombreYApellido }
        </button>
    )
}