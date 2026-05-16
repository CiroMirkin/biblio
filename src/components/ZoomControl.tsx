import { useState } from "react"

const ESCALA_MIN = 0.7
const ESCALA_MAX = 1.3
const ESCALA_PASO = 0.05
const STORAGE_KEY = "zoom"

function getEscalaInicial(): number {
    const guardada = localStorage.getItem(STORAGE_KEY)
    if (!guardada) return 1
    const valor = parseFloat(guardada)
    if (isNaN(valor)) return 1
    return Math.min(Math.max(valor, ESCALA_MIN), ESCALA_MAX)
}

function aplicarEscala(escala: number) {
    document.documentElement.style.fontSize = `${escala * 100}%`
    localStorage.setItem(STORAGE_KEY, escala.toString())
}

export function ZoomControl() {
    const [escala, setEscala] = useState(() => {
        const inicial = getEscalaInicial()
        aplicarEscala(inicial)
        return inicial
    })

    const aumentar = () => setEscala(prev => {
        const nueva = Math.min(parseFloat((prev + ESCALA_PASO).toFixed(2)), ESCALA_MAX)
        aplicarEscala(nueva)
        return nueva
    })

    const reducir = () => setEscala(prev => {
        const nueva = Math.max(parseFloat((prev - ESCALA_PASO).toFixed(2)), ESCALA_MIN)
        aplicarEscala(nueva)
        return nueva
    })

    return (
        <div className="ml-auto mb-1 mr-2 flex items-center gap-2">
            <button
                onClick={reducir}
                disabled={escala <= ESCALA_MIN}
                className="w-7 h-7 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:cursor-default text-lg leading-none"
            >
                -
            </button>
            <span className="text-base w-10 text-center">{Math.round(escala * 100)}%</span>
            <button
                onClick={aumentar}
                disabled={escala >= ESCALA_MAX}
                className="w-7 h-7 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:cursor-default text-lg leading-none"
            >
                +
            </button>
        </div>
    )
}
