import { useState, useEffect } from "react"
import { ListaSocios } from "./ListaSocios"
import type { Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { cargarCuotasSocio } from "@/services/cargarCuotasSocio"
import { Prestamos } from "./Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { SocioDatos } from "./SocioDatos"
import { ordenarSociosAlfabeticamente } from "@/utils/ordenarSocios"
import { BuscarSocioForm } from "./BuscarSocioForm"
import { levenshtein } from "@/utils"

export function Socios() {
  const [cuotas, setCuotas] = useState(false)
  const [socios, setSocios] = useState<Socio[]>([])
  const [sociosFiltrados, setSociosFiltrados] = useState<Socio[]>([])
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null)
  const [mesesCuotas, setMesesCuotas] = useState<Record<string, boolean>[]>([])
  const [anio, setAnio] = useState(new Date().getFullYear())

  useEffect(() => {
    cargarSocios().then(socios => {
      const ordenados = ordenarSociosAlfabeticamente(socios)
      setSocios(ordenados)
      setSociosFiltrados(ordenados)
    }).catch(console.error)
  }, [])

  const cargarCuotas = (socio: Socio, anioSeleccionado: number) => {
    cargarCuotasSocio(socio.nroSocio, anioSeleccionado).then(setMesesCuotas).catch(console.error)
  }

  const handleSearch = (apellido: string) => {
    if (!apellido.trim()) {
      setSociosFiltrados(socios)
      return
    }

    const query = apellido.toLowerCase().trim()

    const filtrados = socios.filter(socio => {
      const nombre = socio.nombreYApellido.toLowerCase()
      if (nombre.includes(query)) return true

      return nombre.split(' ').some(palabra => {
        if (palabra.startsWith(query)) return true
        if (query.length < 5) return false
        if (Math.abs(palabra.length - query.length) > 1) return false
        return levenshtein(palabra, query) <= 1
      })
    })

    setSociosFiltrados(filtrados)
    setCuotas(false)
  }

  const handleSelect = (socio: Socio) => {
    setSocioSeleccionado(socio)
    setCuotas(true)
    cargarCuotas(socio, anio)
  }

  const handleToggleMes = async (mesIndex: number) => {
    if (!socioSeleccionado) return

    try {
      const pagado = await window.electronAPI.toggleCuota(socioSeleccionado.nroSocio, anio, mesIndex)

      setMesesCuotas(prev => {
        const next = [...prev]
        const key = Object.keys(next[mesIndex])[0]
        next[mesIndex] = { [key]: pagado }
        return next
      })
    } catch (e) {
      console.error('Error al actualizar cuota:', e)
    }
  }

  const handleAnioAnterior = () => {
    if (!socioSeleccionado) return
    const nuevoAnio = anio - 1
    setAnio(nuevoAnio)
    cargarCuotas(socioSeleccionado, nuevoAnio)
  }

  const handleAnioSiguiente = () => {
    if (!socioSeleccionado) return
    const nuevoAnio = anio + 1
    setAnio(nuevoAnio)
    cargarCuotas(socioSeleccionado, nuevoAnio)
  }

  return (
    <>
      <div className="">
        <main className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 rounded bg-white/60 transition-colors duration-100">
          <div>
            <BuscarSocioForm onSearch={handleSearch} />
            <ListaSocios socios={sociosFiltrados} onSelect={handleSelect} />
          </div>
          {!cuotas && (
            <aside className="p-4 sticky h-auto rounded bg-white text-base">
              <p>Dentro de esta sección puedes:</p>
              <ul className="pl-4 pt-1 ml-1 list-disc">
                <li>Buscar socios según su apellido,</li>
                <li>ver sus datos personales</li>
                <li>el estado de sus cuotas,</li>
                <li>el préstamo y devolución de libros,</li>
                <li>darlo de baja o reincribirlo.</li>
              </ul>
            </aside>
          )}
        </main>
      </div>

      {cuotas && (
        <div className="pt-6 grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-8">
            <SocioDatos socio={socioSeleccionado} />

            <div className="flex flex-col gap-4 card">
              <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
              <Prestamos nombreSocio={socioSeleccionado!.nombreYApellido} nroSocio={socioSeleccionado?.nroSocio} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded">
              <h2 className="pb-4 text-xl">Cuotas {anio}</h2>

              <CalendarioCuotas
                meses={mesesCuotas}
                anio={anio}
                onToggleMes={handleToggleMes}
                onAnioAnterior={handleAnioAnterior}
                onAnioSiguiente={handleAnioSiguiente}
              />
            </div>
            <div className="mt-2 flex gap-4 card">
              <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
              <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}