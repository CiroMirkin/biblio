import { type LibroRegistrado } from "@shared/models"

export const FIELDS = ['numeroInventario', 'titulo', 'autor'] as const

export const emptyInput = () => ({
  autor: '',
  titulo: '',
  numeroInventario: '',
  fechaDePrestamo: '',
})

export type InputLibro = ReturnType<typeof emptyInput>

export type SlotLibro = {
  type: 'libro'
  data: LibroRegistrado
}
export type SlotInput = {
  type: 'input'
  id: string
}
export type Slot = SlotLibro | SlotInput

export const colNro = "w-[15%]"
export const colTitulo = "w-[40%]"
export const colAutor = "w-[35%]"
export const colFecha = "w-[10%]"
export const colBtn = "w-[10%]"
