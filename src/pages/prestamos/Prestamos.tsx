import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { ListaLibrosVencidos } from "./ListaLibrosVencidos"
import { BuscarLibroForm } from "./BuscarLibroForm"
import { ListaLibrosEnPrestamo } from "./ListaLibrosEnPrestamo"

export function Prestamos() {
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
            </section>
            <aside className="sticky top-0 h-fit">
                <section className="card">
                    <p>En esta sección puede buscar un libro en préstamo, después de {limiteDeDias} días los libros se marcan en rojo como adeudados.</p>
                </section>
            </aside>
        </div>
    )
}