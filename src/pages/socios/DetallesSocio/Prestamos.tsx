import { useEffect, useRef, useState } from "react"
import { getCaracterSocio, type Libro, type LibroEnPrestamo } from "@/models"
import { cn, formatAutor, formatFecha, formatTitulo } from "@/utils"
import { useSociosStore, useLibrosStore } from "@/store"
import { CheckIcon } from "@/components"
import { ExplicacionSocioInactivo } from "./ExplicacionSocioInactivo"

const FIELDS = ['numeroInventario', 'titulo', 'autor'] as const

const emptyLibro = () => ({
  autor: '',
  titulo: '',
  numeroInventario: '',
  fechaDePrestamo: '',
})

const colAutor = "w-[35%]"
const colTitulo = "w-[40%]"
const colNro = "w-[15%]"
const colBtn = "w-[10%]"
const colFecha = "w-[10%]"

export function Prestamos() {
  const { socioSeleccionado: socio } = useSociosStore()
  const {
    getLibrosSocio,
    agregarLibroEnPrestamo,
    devolverLibro,
    maximoLibrosEnPrestamo,
    getLibroPorInventario,
    inicializar,
    fechaDePrestamoAutomatica,
  } = useLibrosStore()

  const caracterSocio = getCaracterSocio(socio?.caracterSocio).estado
  const nombreSocio = socio!.nombreYApellido || ""
  const nroSocio = socio?.nroSocio

  const [libros, setLibros] = useState<LibroEnPrestamo[]>([])
  const [inputs, setInputs] = useState(
    Array.from({ length: maximoLibrosEnPrestamo }, emptyLibro)
  )
  const [lockedRows, setLockedRows] = useState<boolean[]>(
    Array.from({ length: maximoLibrosEnPrestamo }, () => false)
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const fechaRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inicializar()
  }, [])

  useEffect(() => {
    if (!nroSocio) return
    getLibrosSocio(nombreSocio, nroSocio).then(setLibros)
  }, [nroSocio, nombreSocio])

  function handleChange(index: number, field: keyof ReturnType<typeof emptyLibro>, value: string) {
    if (field === 'numeroInventario') {
      setLockedRows(prev => prev.map((v, j) => j === index ? false : v))
      setInputs(prev => prev.map((input, i) => i !== index ? input : { ...input, numeroInventario: value, titulo: '', autor: '' }))
      return
    }
    setInputs(prev => prev.map((input, i) => i !== index ? input : { ...input, [field]: value }))
  }

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldIndex: number) {
    if (e.key !== 'Enter') return
    e.preventDefault()

    if (fieldIndex === 0) {
      const nro = Number(inputs[rowIndex].numeroInventario)
      if (!nro) return

      const libro = getLibroPorInventario(nro)

      if (libro) {
        setInputs(prev => prev.map((input, i) => i === rowIndex
          ? {
              numeroInventario: String(libro.numeroInventario || ""),
              autor: libro.autor || "",
              titulo: libro.titulo,
              fechaDePrestamo: input.fechaDePrestamo
            }
          : input
        ))
        setLockedRows(prev => prev.map((v, i) => i === rowIndex ? true : v))
        setTimeout(() => {
          if (!fechaDePrestamoAutomatica) {
            fechaRefs.current[rowIndex]?.focus()
          }
          else {
            inputRefs.current[(rowIndex + 1) * FIELDS.length]?.focus()
          }
        }, 50)
      }
      else {
        setLockedRows(prev => prev.map((v, i) => i === rowIndex ? false : v))
        setTimeout(() => inputRefs.current[rowIndex * FIELDS.length + 1]?.focus(), 50)
      }
      return
    }

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

      const fecha = input.fechaDePrestamo
        ? new Date(`${input.fechaDePrestamo}T10:30:45.789+00:00`)
        : undefined
      const libroEnPrestamo = await agregarLibroEnPrestamo(libro, {
        fechaDePrestamo: fecha,
      })

      if (libroEnPrestamo) agregados.push(libroEnPrestamo)
    }

    setLibros(prev => [...prev, ...agregados])
    setInputs(Array.from({ length: maximoLibrosEnPrestamo }, emptyLibro))
    setLockedRows(Array.from({ length: maximoLibrosEnPrestamo }, () => false))
  }

  async function handleDevolver(nroInventario: number | string) {
    await devolverLibro(nroInventario)
    setLibros(prev => prev.filter(l => l.numeroInventario !== nroInventario))
  }

  const slotsOcupados = libros.length
  const slotsLibres = Math.max(0, maximoLibrosEnPrestamo - slotsOcupados)

  if (!caracterSocio && libros.length === 0) {
    return <ExplicacionSocioInactivo />
  }

  return (
    <form className="w-full flex flex-col rounded">
      <div className="flex items-end gap-2 px-2 pb-2 text-sm font-semibold text-gray-600">
        <span className={colNro}>N° Inventario</span>
        <span className={colTitulo}>Título</span>
        <span className={colAutor}>Autor</span>
        <span className={colFecha}>Fecha</span>
        <span className={cn(colBtn, "pl-2.5")}>Devolver</span>
      </div>

      {libros.map((libro, index) => (
        <div
          key={libro.numeroInventario}
          className={`flex items-center gap-2 rounded py-3 px-2 ${index % 2 === 0 ? "bg-white-accent" : "bg-white"}`}
        >
          <span className={cn("text-lg", colNro)}>
            {libro.numeroInventario!.toString().startsWith('SN-') ? 'S/N' : libro.numeroInventario}
          </span>
          <span className={cn("text-lg wrap-break-word", colTitulo)}>{libro.titulo}</span>
          <span className={cn("text-lg wrap-break-word", colAutor)}>{libro.autor}</span>
          <span className={cn("text-lg", colFecha)}>{formatFecha(libro.fechaDePrestamo)}</span>
          <div className={cn(colBtn, "pl-2.5")}>
            <button
              type="button"
              className="btn btn-icon"
              onClick={() => handleDevolver(libro.numeroInventario || 0)}
            >
              <CheckIcon className="w-5" />
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
              onFocus={() => {
                if (field === 'numeroInventario') return
                const nro = Number(inputs[i].numeroInventario)
                if (!nro || lockedRows[i]) return
                const libro = getLibroPorInventario(nro)
                if (!libro) return
                setInputs(prev => prev.map((input, idx) => idx === i
                  ? {
                      numeroInventario: String(libro.numeroInventario || ""),
                      autor: libro.autor || "",
                      titulo: libro.titulo,
                      fechaDePrestamo: input.fechaDePrestamo,
                    }
                  : input
                ))
                setLockedRows(prev => prev.map((v, idx) => idx === i ? true : v))
              }}
              disabled={lockedRows[i] && field !== 'numeroInventario'}
              className={`${field === 'autor' ? colAutor : field === 'titulo' ? colTitulo : colNro} border bg-white border-black rounded p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder={field === 'autor' ? 'Autor' : field === 'titulo' ? 'Título' : 'N°'}
            />
          ))}

          {!fechaDePrestamoAutomatica
            ? <input
                type="date"
                ref={el => { fechaRefs.current[i] = el }}
                value={inputs[i].fechaDePrestamo}
                onChange={e => handleChange(i, 'fechaDePrestamo', e.target.value)}
                className={cn(colBtn, "w-35 border bg-white border-black rounded p-1 px-2")}
                onKeyDown={e => {
                  if (e.key !== 'Enter') return
                  e.preventDefault()
                  inputRefs.current[(i + 1) * FIELDS.length]?.focus()
                }}
              />
            : <>
                <div className={colFecha} />
                <div className={colBtn} />
              </>
          }
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