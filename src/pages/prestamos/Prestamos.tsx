import { useEffect } from "react"
import { useLibrosStore } from "@/store"
import { ListaLibrosVencidos } from "./ListaLibrosVencidos"
import { BuscarLibroForm } from "./BuscarLibroForm"

export function Prestamos() {
    const { inicializar } = useLibrosStore()

    useEffect(() => {
        inicializar()
    }, [])


    return (
        <>
            <BuscarLibroForm />
            <ListaLibrosVencidos />
        </>
    )
}