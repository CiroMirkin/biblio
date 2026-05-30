import { useLibrosStore } from "@/store"
import { LibroEnPrestamo } from "./LibroEnPrestamo"
import { useEffect, useRef, useState } from "react"

const PASO = 10

export function ListaLibrosEnPrestamo() {
    const { librosFiltrados } = useLibrosStore()
    const [cantidad, setCantidad] = useState(PASO)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setCantidad(PASO)
    }, [librosFiltrados])

    useEffect(() => {
        if (!bottomRef.current) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setCantidad(prev => Math.min(prev + PASO, librosFiltrados.length))
            }
        })

        observer.observe(bottomRef.current)
        return () => observer.disconnect()
    }, [librosFiltrados.length, cantidad])

    if (!librosFiltrados.length) return

    return (
        <ul className="flex flex-col gap-3 py-4">
            {librosFiltrados.slice(0, cantidad).map(libro => (
                <LibroEnPrestamo key={libro.numeroInventario} libro={libro} />
            ))}
            <div ref={bottomRef} />
        </ul>
    )
}
