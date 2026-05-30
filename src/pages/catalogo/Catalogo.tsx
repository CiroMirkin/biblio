import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { BuscarLibroForm } from "./BuscarLibroForm"
import { ListaLibrosEnPrestamo } from "./ListaLibrosEnPrestamo"

export function Catalogo() {
    const { inicializar, limiteDeDias } = useLibrosStore()

    useEffect(() => {
        inicializar()
    }, [])

    return (
        <div className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 mt-4">
            <section>
                <BuscarLibroForm />
                <ListaLibrosEnPrestamo />
            </section>
            <aside className="sticky top-0 h-fit flex flex-col gap-4">
                <section className="card flex flex-col gap-2">
                    <p>En esta sección puede buscar un libro por su titulo, si el libro esta en préstamo puede saber quien lo tiene.</p>
                    <p>Si un libro esta prestado hace mas de {limiteDeDias} días se marca en rojo como adeudado.</p>
                </section>
            </aside>
        </div>
    )
}