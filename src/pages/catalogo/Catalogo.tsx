import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { ListaLibrosVencidos } from "./ListaLibrosVencidos"
import { BuscarLibroForm } from "./BuscarLibroForm"
import { ListaLibrosEnPrestamo } from "./ListaLibrosEnPrestamo"
import { ListaLibrosDisponibles } from "./ListaLibrosDisponibles"

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
                <ListaLibrosVencidos />
                <ListaLibrosDisponibles />
            </section>
            <aside className="sticky top-0 h-fit">
                <section className="card">
                    <p>En esta sección puede buscar un libro, si el libro esta en préstamo puede saber quien lo tiene y después de {limiteDeDias} días el libro en préstamo se marca en rojo como adeudado.</p>
                </section>
            </aside>
        </div>
    )
}