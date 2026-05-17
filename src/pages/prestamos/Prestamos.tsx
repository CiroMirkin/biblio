import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { ListaLibrosVencidos } from "./ListaLibrosVencidos"
import { BuscarLibroForm } from "./BuscarLibroForm"
import { ListaLibrosEnPrestamo } from "./ListaLibrosEnPrestamo"

export function Prestamos() {
    const { inicializar } = useLibrosStore()

    useEffect(() => {
        inicializar()
    }, [])

    return (
        <>
            <BuscarLibroForm />
            <ListaLibrosEnPrestamo />
            <ListaLibrosVencidos />
        </>
    )
}