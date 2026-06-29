import { IngresoSimple } from "./IngresoSimple"
import { IngresoMarc21 } from "./IngresoMarc21"
import { useSettingsStore } from "@/store"

export function IngresoLibros() {
    const { catalogacionSimple } = useSettingsStore()
    
    return (
        <>
            { catalogacionSimple && <IngresoSimple /> }
            { !catalogacionSimple && <IngresoMarc21 /> }
        </>
    )
}
