import { useImperativeHandle, useRef, useState, type Ref } from "react"
import { cn } from "@/utils"
import { useLibrosStore, useSettingsStore } from "@/store"
import { InputFechaPrestamo } from "./InputFechaPrestamo"
import { FIELDS, colAutor, colBtn, colFecha, colNro, colTitulo, emptyInput, type InputLibro } from "./types"

export interface FilaCargaLibroHandle {
  getInput: () => InputLibro
  focus: () => void
}

interface Props {
  ref: Ref<FilaCargaLibroHandle>
  index: number
  disabled: boolean
  onSiguiente: () => void
}

export function FilaCargaLibro({ ref, index, disabled, onSiguiente }: Props) {
  const { getLibroPorInventario } = useLibrosStore()
  const { fechaDePrestamoAutomatica, numerosDeInventarioExternos } = useSettingsStore()

  const [input, setInput] = useState<InputLibro>(emptyInput)
  const [locked, setLocked] = useState(false)
  const [enPrestamo, setEnPrestamo] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const fechaRef = useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    getInput: () => input,
    focus: () => inputRefs.current[0]?.focus(),
  }), [input])

  function completarConLibro(libro: NonNullable<ReturnType<typeof getLibroPorInventario>>) {
    setInput(prev => ({
      numeroInventario: String(libro.numeroInventario || ""),
      autor: libro.autor || "",
      titulo: libro.titulo,
      fechaDePrestamo: prev.fechaDePrestamo,
    }))
    setLocked(true)
  }

  function handleChange(field: keyof InputLibro, value: string) {
    if (field === 'numeroInventario') {
      setLocked(false)
      setEnPrestamo(false)
      setInput(prev => ({
        ...prev,
        numeroInventario: value,
        titulo: '',
        autor: '',
      }))
      return
    }
    setInput(prev => ({ ...prev, [field]: value }))
  }

  function handleFocusCampo() {
    const nro = Number(input.numeroInventario)
    if (!nro || locked) return
  
    const libro = getLibroPorInventario(nro)
    if (!libro || disabled) return

    if (libro.fechaDePrestamo) {
      setEnPrestamo(true)
      return
    }
    completarConLibro(libro)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, fieldIndex: number) {
    if (e.key !== 'Enter') return
    e.preventDefault()

    if (fieldIndex === 0) {
      const nro = Number(input.numeroInventario)
      if (!nro || disabled) return

      const libro = getLibroPorInventario(nro)

      if (libro?.fechaDePrestamo) {
        setEnPrestamo(true)
        return
      }

      setEnPrestamo(false)

      if (libro) {
        completarConLibro(libro)
        setTimeout(() => {
          if (!fechaDePrestamoAutomatica) fechaRef.current?.focus()
          else onSiguiente()
        }, 50)
      }
      else {
        setLocked(false)
        setTimeout(() => inputRefs.current[1]?.focus(), 50)
      }
      return
    }

    const nextFieldIndex = fieldIndex + 1
    if (nextFieldIndex < FIELDS.length) inputRefs.current[nextFieldIndex]?.focus()
    else onSiguiente()
  }

  return (
    <div
      className={`flex items-center gap-2 py-3 px-2 rounded ${index % 2 === 0 ? "bg-white-accent" : "bg-white"}`}
    >
      <input
        ref={el => { inputRefs.current[0] = el }}
        type="text"
        value={input.numeroInventario}
        onChange={e => handleChange('numeroInventario', e.target.value)}
        onKeyDown={e => handleKeyDown(e, 0)}
        className={cn(
          "border bg-white border-black rounded p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed",
          colNro,
          !numerosDeInventarioExternos && "hidden",
        )}
        disabled={disabled}
        placeholder="N°"
        maxLength={5}
      />

      {enPrestamo
        ? (
          <span className={cn("text-lg font-semibold text-red", colTitulo, colAutor)}>
            El libro ya está en préstamo, verificá el N° de inventario
          </span>
        )
        : (
          <>
            {FIELDS.filter(f => f !== 'numeroInventario').map((field, fieldIndex) => (
              <input
                key={field}
                ref={el => { inputRefs.current[fieldIndex + 1] = el }}
                type="text"
                value={input[field]}
                onChange={e => handleChange(field, e.target.value)}
                onKeyDown={e => handleKeyDown(e, fieldIndex + 1)}
                onFocus={handleFocusCampo}
                disabled={locked || disabled}
                className={cn(
                  "border bg-white border-black rounded p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed placeholder:opacity-85",
                  field === 'autor' ? colAutor : colTitulo,
                )}
                placeholder={field === 'autor' ? 'Autor (Apellido, Nombre)' : 'Título'}
              />
            ))}

            {fechaDePrestamoAutomatica
              ? <>
                  <div className={colFecha} />
                  <div className={colBtn} />
                </>
              : <InputFechaPrestamo
                  value={input.fechaDePrestamo}
                  onChange={value => handleChange('fechaDePrestamo', value)}
                  onEnter={onSiguiente}
                  inputRef={el => { fechaRef.current = el }}
                />
            }
          </>
        )
      }
    </div>
  )
}
