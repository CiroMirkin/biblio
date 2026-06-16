import { useSociosStore } from "@/store";
import { cn } from "@/utils";
import { useState } from "react";
import { ListaDeVinculados } from "./ListaDeVinculados";
import { VincularSocio } from "./VincularSocio";

export function SociosVinculados() {
    const [ showInput, setShowInput ] = useState(false)
    const { buscar, sociosVinculados } = useSociosStore()
    const noHayVinculados = !sociosVinculados.length

    return (
        <section className="card bg-white/90 flex flex-col gap-4">
            <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={cn("min-w-36 text-base opacity-60", noHayVinculados && "hidden")}>Socios Vinculados:</h3>
                    <ListaDeVinculados />
                </div>

                <button
                    className="shrink-0 ml-auto block justify-self-baseline opacity-50 hover:underline"
                    onClick={ () => { setShowInput((prev) => !prev); buscar("") } }
                >
                    { !showInput ? "Vincular socio" : "Vinculación con otro socio" }
                </button>
            </div>
            
            <div className={ cn("mt-3", !showInput && "hidden") }>
                <VincularSocio />
            </div>
        </section>
    )
}