import { useLibrosClasificados, useLibrosStore } from "@/store"
import { LibroEnPrestamo } from "./LibroEnPrestamo"
import { useEffect, useMemo, useRef, useState } from "react"

const PASO = 10

export function ListaLibrosEnPrestamo() {
    const { filtrados: librosFiltrados } = useLibrosClasificados()
    const sinBusqueda = !useLibrosStore(s => s.query).trim()
    const [invertido, setInvertido] = useState(false)
    const [cantidad, setCantidad] = useState(PASO)
    const bottomRef = useRef<HTMLDivElement>(null)

    const libros = useMemo(() => (
        invertido && sinBusqueda ? [...librosFiltrados].reverse() : librosFiltrados
    ), [librosFiltrados, invertido, sinBusqueda])

    useEffect(() => {
        setCantidad(PASO)
    }, [libros])

    useEffect(() => {
        if (!bottomRef.current) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setCantidad(prev => Math.min(prev + PASO, libros.length))
            }
        })

        observer.observe(bottomRef.current)
        return () => observer.disconnect()
    }, [libros.length, cantidad])

    if (!libros.length) {
        return <p className="tracking-wide text-lg">No se encontraron resultados, pero aún podés probar buscando por autor o por N° de inventario.</p>
    }

    return (
        <ul className="flex flex-col gap-3 pb-4">
            { sinBusqueda &&
                <li className="ml-auto">
                    <button
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:underline cursor-pointer"
                        onClick={() => setInvertido(v => !v)}
                    >
                        {invertido ? "Más recientes primero" : "Más antiguos primero"}
                    </button>
                </li>
            }
            {libros.slice(0, cantidad).map(libro => (
                <LibroEnPrestamo
                    key={`${libro.numeroInventario} ${libro.titulo}`}
                    libro={libro}
                />
            ))}
            <div ref={bottomRef} />
        </ul>
    )
}
