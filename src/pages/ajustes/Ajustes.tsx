import { useSettingsStore } from "@/store"
import { ActualizarApp } from "./ActualizarApp";
import { CopiarExcels } from "./CopiarExcels";
import { MaximoDiasDelPrestamo } from "./MaximoDiasDelPrestamo";
import { MaximoPrestamosForm } from "./MaximoPrestamosForm";
import { MaximoDeCuotasAdeudadas } from "./MaximoDeCuotasAdeudadas";
import { ComoEstablecerFechaPrestamo } from "./ComoEstablecerFechaPrestamo";
import { PrecioCuota } from "./PrecioCuotas";
import { EstablecerUsoDeCuotas } from "./EstablecerUsoDeCuotas";
import { UsarNumeroDeInventarioExternos } from "./UsarNumeroDeInventarioExternos";
import { PermitirVincularSocios } from "./PermitirVincularSocios";

export function Ajustes() {
    const { gestionDeCuotas } = useSettingsStore()

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4">
            <div>
                <h2 className="pt-4 mb-4 text-xl font-semibold">Ajustes del sistema</h2>
                <div className="flex flex-col gap-4">
                    <EstablecerUsoDeCuotas />
                    { gestionDeCuotas && <PrecioCuota /> }
                    { gestionDeCuotas && <MaximoDeCuotasAdeudadas /> }
                    <MaximoPrestamosForm />
                    <MaximoDiasDelPrestamo />
                    <UsarNumeroDeInventarioExternos />
                    <ComoEstablecerFechaPrestamo />
                    <PermitirVincularSocios />
                    <CopiarExcels />
                    <ActualizarApp />
                </div>
            </div>
            <aside className="sticky top-0 h-fit hidden md:flex flex-col">
                <div className="h-4 w-full bg-transparent" />
                <section className="card mb-4 flex flex-col gap-2">
                    <p>Dentro de esta sección puedes ajustar el sistema según sus necesidades y preferencias.</p>
                </section>
            </aside>
        </div>
    )
}
