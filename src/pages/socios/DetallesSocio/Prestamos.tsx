import { useEffect, useRef, useState } from "react"
import type { Libro, LibroEnPrestamo } from "@/models"
import { cn, formatAutor, formatTitulo } from "@/utils"
import { useSociosStore } from "../useSociosStore"

const MAX_PRESTAMOS = 4
const FIELDS = ['autor', 'titulo', 'numeroInventario'] as const

const emptyLibro = () => ({
  autor: '',
  titulo: '',
  numeroInventario: '',
})

const colAutor = "w-[35%]"
const colTitulo = "w-[35%]"
const colNro = "w-[20%]"
const colBtn = "w-[10%]"

export function Prestamos() {
  const { socioSeleccionado: socio } = useSociosStore()
  const nombreSocio = socio!.nombreYApellido || ""
  const nroSocio = socio?.nroSocio

  const [libros, setLibros] = useState<LibroEnPrestamo[]>([])
  const [inputs, setInputs] = useState(
    Array.from({ length: MAX_PRESTAMOS }, emptyLibro)
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!nroSocio) return
    window.electronAPI.getLibrosPrestadosSocio(nombreSocio, nroSocio).then(setLibros)
  }, [nroSocio, nombreSocio])

  function handleChange(index: number, field: typeof FIELDS[number], value: string) {
    setInputs(prev => prev.map((input, i) => i === index ? { ...input, [field]: value } : input))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldIndex: number) {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const slotsLibres = MAX_PRESTAMOS - libros.length
    const totalInputs = slotsLibres * FIELDS.length
    const currentFlat = rowIndex * FIELDS.length + fieldIndex
    const nextFlat = currentFlat + 1

    if (nextFlat < totalInputs) {
      inputRefs.current[nextFlat]?.focus()
    }
  }

  async function handleAgregar() {
    const nuevos = inputs.filter(input => input.titulo || input.numeroInventario)
    if (nuevos.length === 0) return

    for (const input of nuevos) {
      const libro: Libro = {
        autor: formatAutor(input.autor),
        titulo: formatTitulo(input.titulo),
        nombreSocio,
        numeroSocio: nroSocio ?? null,
        numeroInventario: Number(input.numeroInventario) || 0,
      }
      const libroEnPrestamo = await window.electronAPI.addLibroPrestado(libro)
      if (libroEnPrestamo) setLibros(prev => [...prev, libroEnPrestamo])
    }

    setInputs(Array.from({ length: MAX_PRESTAMOS }, emptyLibro))
  }

  async function handleDevolver(nroInventario: number) {
    const ok = await window.electronAPI.devolverLibro(nroInventario)
    if (ok) setLibros(libros.filter(libro => libro.numeroInventario !== nroInventario))
  }

  const slotsOcupados = libros.length
  const slotsLibres = MAX_PRESTAMOS - slotsOcupados

  return (
    <form className="w-full flex flex-col rounded">
      <div className="flex gap-2 px-2 py-1 text-sm font-semibold text-gray-600">
        <span className={colAutor}>Autor</span>
        <span className={colTitulo}>Título</span>
        <span className={colNro}>N° Inventario</span>
        <span className={colBtn}>Devolver</span>
      </div>

      {libros.map((libro, index) => (
        <div
          key={libro.numeroInventario}
          className={`flex items-center gap-2 rounded py-3 px-2 ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
        >
          <span className={cn("text-lg truncate", colAutor)}>{libro.autor}</span>
          <span className={cn("text-lg truncate", colTitulo)}>{libro.titulo}</span>
          <span className={cn("text-lg", colNro)}>N° {libro.numeroInventario}</span>
          <div className={colBtn}>
            <button
              type="button"
              className="btn w-full overflow-hidden whitespace-nowrap text-ellipsis"
              onClick={() => handleDevolver(libro.numeroInventario)}
            >Devuelto</button>
          </div>
        </div>
      ))}

      {Array.from({ length: slotsLibres }, (_, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 py-3 px-2 rounded ${(slotsOcupados + i) % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
        >
          {FIELDS.map((field, fieldIndex) => (
            <input
              key={field}
              ref={el => { inputRefs.current[i * FIELDS.length + fieldIndex] = el }}
              type="text"
              value={inputs[i][field]}
              onChange={e => handleChange(i, field, e.target.value)}
              onKeyDown={e => handleKeyDown(e, i, fieldIndex)}
              className={`${field === 'autor' ? colAutor : field === 'titulo' ? colTitulo : colNro} border bg-white border-black rounded p-1 px-2`}
              placeholder={field === 'autor' ? 'Autor' : field === 'titulo' ? 'Título' : 'N° Inventario'}
            />
          ))}
          <div className={colBtn} />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAgregar}
        className="bg-[#8cbfb3] mt-4 p-1 pb-2 text-lg rounded"
      >
        Registrar préstamo
      </button>
    </form>
  )
}