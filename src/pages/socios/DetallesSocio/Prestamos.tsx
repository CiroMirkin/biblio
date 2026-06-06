import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { getCaracterSocio, type Libro, type LibroEnPrestamo } from "@/models"
import { calcularDiasDesdePrestamo, cn, formatAutor, formatFecha, formatTitulo } from "@/utils"
import { useSociosStore, useLibrosStore } from "@/store"
import { CheckIcon } from "@/components"
import { ExplicacionSocioInactivo } from "./ExplicacionSocioInactivo"

const FIELDS = ['numeroInventario', 'titulo', 'autor'] as const

const emptyInput = () => ({
  autor: '',
  titulo: '',
  numeroInventario: '',
  fechaDePrestamo: '',
})

type SlotLibro = { type: 'libro'; data: LibroEnPrestamo }
type SlotInput = { type: 'input'; id: string }
type Slot = SlotLibro | SlotInput

const colAutor = "w-[35%]"
const colTitulo = "w-[40%]"
const colNro = "w-[15%]"
const colBtn = "w-[10%]"
const colFecha = "w-[10%]"

interface Props {
  onSuccess: () => void
}

export function Prestamos({ onSuccess }: Props) {
  const { socioSeleccionado: socio } = useSociosStore()
  const {
    getLibrosSocio,
    agregarLibroEnPrestamo,
    devolverLibro,
    maximoLibrosEnPrestamo,
    limiteDeDias,
    getLibroPorInventario,
    inicializar,
    fechaDePrestamoAutomatica,
  } = useLibrosStore()

  const caracterSocio = getCaracterSocio(socio?.caracterSocio).estado
  const nombreSocio = socio!.nombreYApellido || ""
  const nroSocio = socio?.nroSocio

  const [slots, setSlots] = useState<Slot[]>([])
  const [inputs, setInputs] = useState<Record<string, ReturnType<typeof emptyInput>>>({})
  const [lockedInputs, setLockedInputs] = useState<Record<string, boolean>>({})
  const [libroEnPrestamoInputs, setLibroEnPrestamoInputs] = useState<Record<string, boolean>>({})
  const [newlyAdded, setNewlyAdded] = useState<Set<number | string>>(new Set())
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const fechaRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    inicializar()
  }, [])

  useEffect(() => {
    if (!nroSocio) return
    getLibrosSocio(nroSocio).then(libros => {
      const libroSlots: SlotLibro[] = libros.map(l => ({ type: 'libro', data: l }))
      const inputsNeeded = Math.max(0, maximoLibrosEnPrestamo - libros.length)
      const inputSlots: SlotInput[] = Array.from({ length: inputsNeeded }, (_, i) => ({
        type: 'input',
        id: `init-${i}`,
      }))
      const newSlots = [...libroSlots, ...inputSlots]
      setSlots(newSlots)
      const newInputs: Record<string, ReturnType<typeof emptyInput>> = {}
      inputSlots.forEach(s => { newInputs[s.id] = emptyInput() })
      setInputs(newInputs)
    })
  }, [nroSocio, nombreSocio])

  function getInputSlots(): SlotInput[] {
    return slots.filter((s): s is SlotInput => s.type === 'input')
  }

  function handleChange(id: string, field: keyof ReturnType<typeof emptyInput>, value: string) {
    if (field === 'numeroInventario') {
      setLockedInputs(prev => ({ ...prev, [id]: false }))
      setLibroEnPrestamoInputs(prev => ({ ...prev, [id]: false }))
      setInputs(prev => ({ ...prev, [id]: { ...prev[id], numeroInventario: value, titulo: '', autor: '' } }))
      return
    }
    setInputs(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: string, fieldIndex: number) {
    if (e.key !== 'Enter') return
    e.preventDefault()

    if (fieldIndex === 0) {
      const nro = Number(inputs[id]?.numeroInventario)
      if (!nro) return

      const libro = getLibroPorInventario(nro)
 
      if (libro?.fechaDePrestamo) {
        setLibroEnPrestamoInputs(prev => ({ ...prev, [id]: true }))
        return
      }

      setLibroEnPrestamoInputs(prev => ({ ...prev, [id]: false }))

      if (libro) {
        setInputs(prev => ({
          ...prev,
          [id]: {
            numeroInventario: String(libro.numeroInventario || ""),
            autor: libro.autor || "",
            titulo: libro.titulo,
            fechaDePrestamo: prev[id].fechaDePrestamo,
          }
        }))
        setLockedInputs(prev => ({ ...prev, [id]: true }))
        setTimeout(() => {
          if (!fechaDePrestamoAutomatica) {
            fechaRefs.current[id]?.focus()
          }
          else {
            const inputSlots = getInputSlots()
            const idx = inputSlots.findIndex(s => s.id === id)
            const nextSlot = inputSlots[idx + 1]
            if (nextSlot) inputRefs.current[`${nextSlot.id}-0`]?.focus()
          }
        }, 50)
      }
      else {
        setLockedInputs(prev => ({ ...prev, [id]: false }))
        setTimeout(() => inputRefs.current[`${id}-1`]?.focus(), 50)
      }
      return
    }

    const inputSlots = getInputSlots()
    const slotIdx = inputSlots.findIndex(s => s.id === id)
    const nextFieldIndex = fieldIndex + 1

    if (nextFieldIndex < FIELDS.length) {
      inputRefs.current[`${id}-${nextFieldIndex}`]?.focus()
    } else {
      const nextSlot = inputSlots[slotIdx + 1]
      if (nextSlot) inputRefs.current[`${nextSlot.id}-0`]?.focus()
    }
  }

  async function handleAgregar() {
    const inputSlots = getInputSlots()
    const nuevos = inputSlots.filter(s => inputs[s.id]?.titulo || inputs[s.id]?.numeroInventario)
    if (nuevos.length === 0) return

    const agregados: Array<{ slotId: string; libro: LibroEnPrestamo }> = []

    for (const slot of nuevos) {
      const input = inputs[slot.id]
      const numeroInventario = isNaN(Number(input.numeroInventario.toString()))
        ? ""
        : input.numeroInventario

      const libro: Libro = {
        autor: formatAutor(input.autor),
        titulo: formatTitulo(input.titulo),
        nombreSocio,
        numeroSocio: nroSocio ?? null,
        numeroInventario,
      }

      const fecha = input.fechaDePrestamo
        ? new Date(`${input.fechaDePrestamo}T10:30:45.789+00:00`)
        : undefined

      const libroEnPrestamo = await agregarLibroEnPrestamo(libro, { fechaDePrestamo: fecha })
      if (libroEnPrestamo) agregados.push({ slotId: slot.id, libro: libroEnPrestamo })
    }

    if (agregados.length > 0) {
      setSlots(prev => prev.map(slot => {
        if (slot.type !== 'input') return slot
        const agregado = agregados.find(a => a.slotId === slot.id)
        if (!agregado) return slot
        return { type: 'libro', data: agregado.libro } satisfies SlotLibro
      }))

      setInputs(prev => {
        const next = { ...prev }
        agregados.forEach(a => { delete next[a.slotId] })
        return next
      })
      setLockedInputs(prev => {
        const next = { ...prev }
        agregados.forEach(a => { delete next[a.slotId] })
        return next
      })
      setLibroEnPrestamoInputs(prev => {
        const next = { ...prev }
        agregados.forEach(a => { delete next[a.slotId] })
        return next
      })

      const ids = new Set(agregados.map(a => a.libro.numeroInventario!))
      setNewlyAdded(ids)
      setTimeout(() => setNewlyAdded(new Set()), 1500)
      onSuccess()
    }
  }

  async function handleDevolver(slotIndex: number, nroInventario: number | string) {
    await devolverLibro(nroInventario)
    const newId = `devuelto-${Date.now()}`
    setSlots(prev => prev.map((slot, i) => {
      if (i !== slotIndex) return slot
      return { type: 'input', id: newId } satisfies SlotInput
    }))
    setInputs(prev => ({ ...prev, [newId]: emptyInput() }))
  }

  const libroSlots = slots.filter(s => s.type === 'libro')
  const hasLibros = libroSlots.length > 0

  if (!caracterSocio && !hasLibros) {
    return <ExplicacionSocioInactivo />
  }

  return (
    <form className="w-full flex flex-col rounded">
      <div className="flex items-end gap-2 px-2 pb-2 text-sm font-semibold text-gray-600">
        <span className={colNro}>N° Inventario</span>
        <span className={colTitulo}>Título</span>
        <span className={colAutor}>Autor</span>
        <span className={cn(colFecha, !hasLibros && "opacity-0")}>Fecha</span>
        <span className={cn(colBtn, "pl-2.5", !hasLibros && "opacity-0")}>Devolver</span>
      </div>

      {slots.map((slot, slotIndex) => {
        if (slot.type === 'libro') {
          const libro = slot.data
          const isNew = newlyAdded.has(libro.numeroInventario!)
          const baseBg = slotIndex % 2 === 0 ? "#fddc87" : "#fef0c6"
          return (
            <motion.div
              key={libro.numeroInventario}
              className="flex items-center gap-2 rounded py-3 px-2"
              animate={{ backgroundColor: isNew ? "#91bf8f" : baseBg }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className={cn("text-lg", colNro)}>
                {libro.numeroInventario!.toString().startsWith('SN-') || !libro.numeroInventario ? 'S/N' : libro.numeroInventario}
              </span>
              <span className={cn("text-lg wrap-break-word", colTitulo)}>{libro.titulo}</span>
              <span className={cn("text-lg wrap-break-word", colAutor)}>{libro.autor}</span>
              <span
                className={cn(
                  "text-lg", colFecha,
                  calcularDiasDesdePrestamo(libro.fechaDePrestamo!) > limiteDeDias && "bg-[#f582ae59] px-1°! rounded"
                )}
                title={`${calcularDiasDesdePrestamo(libro.fechaDePrestamo!)} dias`}
              >
                {formatFecha(libro.fechaDePrestamo)}
              </span>
              <div className={cn(colBtn, "pl-2.5")}>
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={() => handleDevolver(slotIndex, libro.numeroInventario || "")}
                >
                  <CheckIcon className="w-5" />
                </button>
              </div>
            </motion.div>
          )
        }

        const { id } = slot
        const input = inputs[id] ?? emptyInput()
        const enPrestamo = libroEnPrestamoInputs[id] ?? false

        return (
          <div
            key={id}
            className={`flex items-center gap-2 py-3 px-2 rounded ${slotIndex % 2 === 0 ? "bg-white-accent" : "bg-white"}`}
          >
            <input
              ref={el => { inputRefs.current[`${id}-0`] = el }}
              type="text"
              value={input.numeroInventario}
              onChange={e => handleChange(id, 'numeroInventario', e.target.value)}
              onKeyDown={e => handleKeyDown(e, id, 0)}
              className={`${colNro} border bg-white border-black rounded p-1 px-2`}
              placeholder="N°"
            />

            {enPrestamo
              ? (
                <span className={cn("text-lg font-semibold text-red-600", colTitulo, colAutor)}>
                  El libro ya está en préstamo, verificá el N° de inventario
                </span>
              )
              : (
                <>
                  {FIELDS.filter(f => f !== 'numeroInventario').map((field, fieldIndex) => (
                    <input
                      key={field}
                      ref={el => { inputRefs.current[`${id}-${fieldIndex + 1}`] = el }}
                      type="text"
                      value={input[field]}
                      onChange={e => handleChange(id, field, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, id, fieldIndex + 1)}
                      onFocus={() => {
                        const nro = Number(input.numeroInventario)
                        if (!nro || lockedInputs[id]) return
                        const libro = getLibroPorInventario(nro)
                        if (!libro) return
                        if (libro?.fechaDePrestamo) {
                          setLibroEnPrestamoInputs(prev => ({ ...prev, [id]: true }))
                          return
                        }
                        setInputs(prev => ({
                          ...prev,
                          [id]: {
                            numeroInventario: String(libro.numeroInventario || ""),
                            autor: libro.autor || "",
                            titulo: libro.titulo,
                            fechaDePrestamo: prev[id].fechaDePrestamo,
                          }
                        }))
                        setLockedInputs(prev => ({ ...prev, [id]: true }))
                      }}
                      disabled={lockedInputs[id]}
                      className={`${field === 'autor' ? colAutor : colTitulo} border bg-white border-black rounded p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder={field === 'autor' ? 'Autor' : 'Título'}
                    />
                  ))}

                  {!fechaDePrestamoAutomatica
                    ? <input
                        type="date"
                        ref={el => { fechaRefs.current[id] = el }}
                        value={input.fechaDePrestamo}
                        onChange={e => handleChange(id, 'fechaDePrestamo', e.target.value)}
                        className={cn(colBtn, "w-35 border bg-white border-black rounded p-1 px-2")}
                        onKeyDown={e => {
                          if (e.key !== 'Enter') return
                          e.preventDefault()
                          const inputSlots = getInputSlots()
                          const idx = inputSlots.findIndex(s => s.id === id)
                          const nextSlot = inputSlots[idx + 1]
                          if (nextSlot) inputRefs.current[`${nextSlot.id}-0`]?.focus()
                        }}
                      />
                    : <>
                        <div className={colFecha} />
                        <div className={colBtn} />
                      </>
                  }
                </>
              )
            }
          </div>
        )
      })}

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