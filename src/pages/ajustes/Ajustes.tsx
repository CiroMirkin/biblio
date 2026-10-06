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
import { ImportarCopiaCompleta } from "./ImportarCopiaCompleta";
import { ArchivarHistorial } from "./ArchivarHistorial";
import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Ajustes() {
    const { gestionDeCuotas, numerosDeInventarioExternos } = useSettingsStore()

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4">
            <div className="pb-6">
                <div className="pt-4 flex flex-col gap-4">
                    <NombreBiblioteca />
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Gestión de prestamos</h3>
                        <AjusteSubItem>
                            <MaximoPrestamosForm />
                            <MaximoDiasDelPrestamo />
                            <ComoEstablecerFechaPrestamo />
                        </AjusteSubItem>
                        <ArchivarHistorial />
                    </AjusteSection>
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Gestión de socios</h3>
                        <AjusteContent>
                            <AjustarCamposDeInscripcion />
                            <PermitirVincularSocios />
                        </AjusteContent>
                    </AjusteSection>
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Gestión de cuotas</h3>
                        <AjusteContent>
                            <EstablecerUsoDeCuotas />
                            { gestionDeCuotas && 
                                <AjusteSubItem>
                                    <PrecioCuota />
                                    <MaximoDeCuotasAdeudadas />
                                </AjusteSubItem>
                            }
                        </AjusteContent>
                    </AjusteSection>
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Gestión de inventario</h3>
                        <AjusteContent>
                            <UsarNumeroDeInventarioExternos />
                            { numerosDeInventarioExternos && 
                                <AjusteSubItem>
                                    <EstableceTipoDeCatalogacion />
                                </AjusteSubItem>
                            }
                        </AjusteContent>
                    </AjusteSection>
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Copia de seguridad</h3>
                        <p className="opacity-50">Importar y exportar un archivos excel con la información del sistema.</p>
                        <AjusteContent>
                            <CopiarExcels />
                            <ImportarCopiaCompleta />
                        </AjusteContent>
                    </AjusteSection>
                    <AjusteSection>
                        <h3 className="font-semibold text-xl">Gestión de archivos MARC (Avanzado)</h3>
                        <p className="opacity-50">Permite intercambiar informacion entre otros sistemas como Aguapey o Koha.</p>
                        <AjusteContent>
                            <DescargarArchivoMrc />
                            <ImportarArchivoMrc />
                        </AjusteContent>
                    </AjusteSection>

                    <ActualizarApp />
                    <div className="card mt-4">
                        Ante cualquier inconveniente o sugerencia, puedes enviar un mensaje a traves del 
                        <a
                            href="https://ciromirkin.github.io/biblio/"
                            className="pl-1.5 font-semibold hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                window.electronAPI.openExternal('https://ciromirkin.github.io/biblio/');
                            }}
                        >sitio web</a>.
                    </div>
                </div>
            </div>
            <aside className="sticky top-0 h-fit hidden md:flex flex-col">
                <div className="h-4 w-full bg-transparent" />
                <section className="card mb-4 flex flex-col gap-2">
                    <p>Dentro de esta sección pueden ajustar el sistema según sus necesidades y preferencias.</p>
                </section>
            </aside>
        </div>
    )
}

const AjusteSection = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={cn("card", className)}>{ children }</div>
)

const AjusteContent = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={cn("pt-4 flex flex-col gap-4", className)}>{ children }</div>
)

const AjusteSubItem = ({ children, className }: { children: ReactNode, className?: string }) => (
    <AjusteContent className={cn("pl-8 pt-0", className)}>{ children }</AjusteContent>
)