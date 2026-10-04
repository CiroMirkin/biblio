import { useEffect, useRef, useState } from "react"
import { type LibroRegistrado } from "@shared/models"
import { cn } from "@/utils"
import { useSettingsStore, useVistaStore } from "@/store"
import { BotonRegistrarPrestamo } from "./BotonRegistrarPrestamo"
import { ModalPrestamoSinRegistrar } from "./ModalPrestamoSinRegistrar"
import { FilaLibroPrestado } from "./FilaLibroPrestado"
import { FilaCargaLibro, type FilaCargaLibroHandle } from "./FilaCargaLibro"
import {
  colAutor,
  colBtn,
  colFecha,
  colNro,
  colTitulo,
  type InputLibro,
  type Slot,
  type SlotInput,
  type SlotLibro,
} from "./types"

interface Props {
  libros: LibroRegistrado[]
  disabled: boolean
  /**
   * Devuelve los resultados en el mismo orden que los inputs, así se sabe qué fila convertir.
   * Las que fallan (null) quedan con lo tipeado permitiendo reintentar.
   */
  onRegistrar: (inputs: InputLibro[]) => Promise<Array<LibroRegistrado | null>>
}

export function TablaPrestamos({ libros, disabled, onRegistrar }: Props) {
  const { fechaDePrestamoAutomatica, numerosDeInventarioExternos, maximoLibrosEnPrestamo } = useSettingsStore()

  const [slots, setSlots] = useState<Slot[]>(() => {
    const filasVacias = disabled ? 0 : Math.max(0, maximoLibrosEnPrestamo - libros.length)
    return [
      ...libros.map((l): SlotLibro => ({ type: 'libro', data: l })),
      ...Array.from({ length: filasVacias }, (_, i): SlotInput => ({ type: 'input', id: `init-${i}` })),
    ]
  })
  const filasRef = useRef<Record<string, FilaCargaLibroHandle | null>>({})

  function getInputSlots(): SlotInput[] {
    return slots.filter((s): s is SlotInput => s.type === 'input')
  }

  function focusSiguienteSlot(id: string) {
    const inputSlots = getInputSlots()
    const idx = inputSlots.findIndex(s => s.id === id)
    const nextSlot = inputSlots[idx + 1]
    if (nextSlot) filasRef.current[nextSlot.id]?.focus()
  }

  function getSlotsEscritos() {
    return getInputSlots().flatMap(s => {
      const input = filasRef.current[s.id]?.getInput()
      const isSlotValid = input && input.titulo
      return isSlotValid ? [{ slotId: s.id, input }] : []
    })
  }

  useEffect(() => {
    const haySlotsEscritos = () => getSlotsEscritos().length > 0
    useVistaStore.setState({ hayPrestamoSinRegistrar: haySlotsEscritos })
    return () => {
      // al cambiar de socio la tabla nueva se monta antes de que termine de salir la vieja
      if (useVistaStore.getState().hayPrestamoSinRegistrar === haySlotsEscritos) {
        useVistaStore.setState({ hayPrestamoSinRegistrar: () => false })
      }
    }
  }, [slots])

  /** @returns Indica a `BotonRegistrarPrestamo` si mostrar la acción como exitosa. */
  async function handleAgregar(): Promise<boolean> {
    return (await registrarTipeados()) > 0
  }

  /** @returns Cantidad de préstamos registrados. */
  async function registrarTipeados(): Promise<number> {
    const nuevos = getSlotsEscritos()
    if (nuevos.length === 0) return 0

    const registrados = await onRegistrar(nuevos.map(n => n.input))

    const agregados = new Map<string, LibroRegistrado>()
    nuevos.forEach((n, i) => { 
      const libro = registrados[i]
      if (libro) agregados.set(n.slotId, libro)
    })
    if (agregados.size === 0) return 0

    setSlots(prev => prev.map(slot => {
      if (slot.type !== 'input') return slot
      const libro = agregados.get(slot.id)
      return libro ? { type: 'libro', data: libro } satisfies SlotLibro : slot
    }))
    return agregados.size
  }

  function reemplazarPorFilaVacia(slotIndex: number) {
    const newId = `devuelto-${Date.now()}`
    setSlots(prev => prev.map((slot, i) => {
      if (i !== slotIndex) return slot
      return { type: 'input', id: newId } satisfies SlotInput
    }))
  }

  const hasLibros = slots.some(s => s.type === 'libro')

  if (disabled && !hasLibros) {
    return null
  }

  return (
    <>
    <form className="w-full flex flex-col rounded">
      <div className="flex items-end gap-2 px-2 pb-2 text-sm font-semibold text-gray-600">
        <span className={cn(colNro, "truncate",!numerosDeInventarioExternos && "hidden",)}>
          N° Inventario
        </span>
        <span className={colTitulo}>Título</span>
        <span className={colAutor}>Autor</span>
        <span className={cn(colFecha, !hasLibros && "opacity-0", !fechaDePrestamoAutomatica && "opacity-100")}>Fecha</span>
        <span className={cn(colBtn, "pl-2.5 truncate md:truncate-none!", !hasLibros && "opacity-0")}>Devolver</span>
      </div>

      {slots.map((slot, slotIndex) => {
        if (slot.type === 'libro') {
          const libro = slot.data
          return (
            <FilaLibroPrestado
              key={libro.numeroInventario}
              libro={libro}
              index={slotIndex}
              onDevuelto={() => reemplazarPorFilaVacia(slotIndex)}
            />
          )
        }

        const { id } = slot
        return (
          <FilaCargaLibro
            key={id}
            ref={el => { filasRef.current[id] = el }}
            index={slotIndex}
            disabled={disabled}
            onSiguiente={() => focusSiguienteSlot(id)}
          />
        )
      })}

      {!disabled && <BotonRegistrarPrestamo onRegistrar={handleAgregar} />}
    </form>

    <ModalPrestamoSinRegistrar onRegistrar={registrarTipeados} />
    </>
  )
}
