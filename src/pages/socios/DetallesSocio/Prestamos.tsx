import { useEffect, useRef, useState } from "react"
import { getCaracterSocio, type Libro, type LibroEnPrestamo } from "@/models"
import { cn, formatAutor, formatFecha, formatTitulo } from "@/utils"
import { useSociosStore, useLibrosStore } from "@/store"
import { CheckIcon } from "@/components"

const FIELDS = ['numeroInventario', 'autor', 'titulo'] as const

const emptyLibro = () => ({
  autor: '',
  titulo: '',
  numeroInventario: '',
})

const colAutor = "w-[35%]"
const colTitulo = "w-[40%]"
const colNro = "w-[15%]"
const colBtn = "w-[10%]"
const colFecha = "w-[10%]"

export function Prestamos() {
  const { socioSeleccionado: socio } = useSociosStore()
  const { getLibrosSocio, agregarLibroEnPrestamo, devolverLibro, maximoLibrosEnPrestamo } = useLibrosStore()

  const caracterSocio = getCaracterSocio(socio?.caracterSocio).estado
  const nombreSocio = socio!.nombreYApellido || ""
  const nroSocio = socio?.nroSocio

  const [libros, setLibros] = useState<LibroEnPrestamo[]>([])
  const [inputs, setInputs] = useState(
    Array.from({ length: maximoLibrosEnPrestamo }, emptyLibro)
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!nroSocio) return
    getLibrosSocio(nombreSocio, nroSocio).then(setLibros)
  }, [nroSocio, nombreSocio])

  function handleChange(index: number, field: typeof FIELDS[number], value: string) {
    setInputs(prev => prev.map((input, i) => i === index ? { ...input, [field]: value } : input))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldIndex: number) {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const slotsLibres = maximoLibrosEnPrestamo - libros.length
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

    const agregados: LibroEnPrestamo[] = []
    for (const input of nuevos) {
      const libro: Libro = {
        autor: formatAutor(input.autor),
        titulo: formatTitulo(input.titulo),
        nombreSocio,
        numeroSocio: nroSocio ?? null,
        numeroInventario: Number(input.numeroInventario) || 0,
      }
      const libroEnPrestamo = await agregarLibroEnPrestamo(libro)
      if (libroEnPrestamo) agregados.push(libroEnPrestamo)
    }

    setLibros(prev => [...prev, ...agregados])
    setInputs(Array.from({ length: maximoLibrosEnPrestamo }, emptyLibro))
  }

  async function handleDevolver(nroInventario: number) {
    await devolverLibro(nroInventario)
    setLibros(prev => prev.filter(l => l.numeroInventario !== nroInventario))
  }

  const slotsOcupados = libros.length
  const slotsLibres = Math.max(0, maximoLibrosEnPrestamo - slotsOcupados)

  if (!caracterSocio && libros.length === 0) {
    return <p className="opacity-50">Este socio esta inactivo.</p>
  }

  return (
    <form className="w-full flex flex-col rounded">
      <div className="flex items-end gap-2 px-2 pb-2 text-sm font-semibold text-gray-600">
        <span className={colNro}>N° Inventario</span>
        <span className={colAutor}>Autor</span>
        <span className={colTitulo}>Título</span>
        <span className={colFecha}>Fecha</span>
        <span className={cn(colBtn, "pl-2.5")}>Devolver</span>
      </div>

      {libros.map((libro, index) => (
        <div
          key={libro.numeroInventario}
          className={`flex items-center gap-2 rounded py-3 px-2 ${index % 2 === 0 ? "bg-white-accent" : "bg-white"}`}
        >
          <span className={cn("text-lg", colNro)}>N° {libro.numeroInventario}</span>
          <span className={cn("text-lg wrap-break-word", colAutor)}>{libro.autor}</span>
          <span className={cn("text-lg wrap-break-word", colTitulo)}>{libro.titulo}</span>
          <span className={cn("text-lg", colFecha)}>{formatFecha(libro.fechaDePrestamo)}</span>
          <div className={cn(colBtn, "pl-2.5")}>
            <button
              type="button"
              className="btn btn-icon"
              onClick={() => handleDevolver(libro.numeroInventario)}
            >
              <CheckIcon />
            </button>
          </div>
        </div>
      ))}

      {caracterSocio && Array.from({ length: slotsLibres }, (_, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 py-3 px-2 rounded ${(slotsOcupados + i) % 2 === 0 ? "bg-white-accent" : "bg-white"}`}
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
              placeholder={field === 'autor' ? 'Autor' : field === 'titulo' ? 'Título' : 'N°'}
            />
          ))}
          <div className={colFecha} />
          <div className={colBtn} />
        </div>
      ))}

      {caracterSocio && (
        <button
          type="button"
          onClick={handleAgregar}
          className="btn mt-4 p-1 pb-2 text-lg rounded"
        >
          Registrar préstamo
        </button>
      )}
    </form>
  )
}