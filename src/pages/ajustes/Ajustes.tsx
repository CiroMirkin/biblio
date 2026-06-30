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
import { DescargarArchivoMrc } from "./DescargarArchivoMrc";
import { EstableceTipoDeCatalogacion } from "./EstableceTipoDeCatalogacion";
import { NombreBiblioteca } from "./NombreBiblioteca";
import { ImportarArchivoMrc } from "./ImportarArchivoMrc";
import { AjustarCamposDeInscripcion } from "./AjustarCamposDeInscripcion";

export function Ajustes() {
    const { gestionDeCuotas, numerosDeInventarioExternos } = useSettingsStore()

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4">
            <div className="pb-6">
                <h2 className="pt-4 mb-4 text-xl font-semibold">Ajustes del sistema</h2>
                <div className="flex flex-col gap-4">
                    <NombreBiblioteca />
                    <EstablecerUsoDeCuotas />
                    { gestionDeCuotas && 
                        <div className="pl-8 flex flex-col gap-4">
                            <PrecioCuota />
                            <MaximoDeCuotasAdeudadas />
                        </div>
                    }
                    <MaximoPrestamosForm />
                    <MaximoDiasDelPrestamo />
                    <AjustarCamposDeInscripcion />
                    <ComoEstablecerFechaPrestamo />
                    <PermitirVincularSocios />
                    <UsarNumeroDeInventarioExternos />
                    { numerosDeInventarioExternos && 
                        <div className="pl-8 flex flex-col gap-4">
                            <EstableceTipoDeCatalogacion />
                        </div>
                    }
                    <CopiarExcels />
                    <DescargarArchivoMrc />
                    <ImportarArchivoMrc />
                    <ActualizarApp />
                    <div className="card mt-4">
                        Ante cualquier inconveniente o sugerencia, puedes enviar un mensaje a traves del <a href="https://ciromirkin.github.io/biblio/" className="font-semibold hover:underline">sitio web</a>.
                    </div>
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
