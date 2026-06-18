import { useLibrosStore, useSettingsStore } from "@/store"
import { BuscarLibroForm } from "./BuscarLibroForm"
import { ListaLibrosEnPrestamo } from "./ListaLibrosEnPrestamo"
import { RecuentoLibros } from "./RecuentoLibros"
import { EditarLibro } from "./EditarLibro"
import { cn } from "@/utils"

export function Catalogo() {
    const { limiteDeDias } = useSettingsStore()
    const { showDetallesLibro } = useLibrosStore()

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-[3.5fr_1.5fr] gap-4">
            { showDetallesLibro && 
                <section>
                    <EditarLibro />
                </section>
            }
            { !showDetallesLibro && 
                <section>
                    <div className="sticky inset-y-0 z-50 bg-white">
                        <div className="bg-[#d26fb9c9]">
                            <div className="h-4 w-full bg-transparent" />
                            <BuscarLibroForm />
                            <div className="h-4 w-full bg-transparent" />
                        </div>
                    </div>
                    
                    <ListaLibrosEnPrestamo />
                </section>
            }
            <aside className="sticky top-0 h-fit hidden md:flex flex-col">
                <div className={cn(
                    "w-full bg-transparent",
                    showDetallesLibro ? "h-15.5" : "h-4"
                )} />
                <section className="card mb-4 flex flex-col gap-2">
                    { showDetallesLibro && <>
                        <p>Ahora puedes cambiar el N° de inventario, titulo y autor del libro.</p>
                        <p>Si el libro esta en préstamo la información del préstamo no se perderá.</p>
                    </> }
                    { !showDetallesLibro && <>
                        <p>En esta sección puede buscar un libro por su titulo, si el libro esta en préstamo puede saber quien lo tiene.</p>
                        <p>Si un libro esta prestado hace mas de {limiteDeDias} días se marca en rojo como adeudado.</p>
                    </> }
                </section>

                { !showDetallesLibro && <RecuentoLibros /> }
            </aside>
        </div>
    )
}
