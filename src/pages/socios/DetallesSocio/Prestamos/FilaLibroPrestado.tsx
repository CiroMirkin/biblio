import { type LibroEnPrestamo } from "@shared/models"
import { cn } from "@/utils"
import { useLibrosStore, useSettingsStore } from "@/store"
import { CheckIcon } from "@/components"
import { FechaPrestamo } from "./FechaPrestamo"
import { colAutor, colBtn, colNro, colTitulo } from "./types"

interface Props {
  libro: LibroEnPrestamo
  index: number
  onDevuelto: () => void
}

export function FilaLibroPrestado({ libro, index, onDevuelto }: Props) {
  const { devolverLibro } = useLibrosStore()
  const { numerosDeInventarioExternos } = useSettingsStore()
  const bg = index % 2 === 0 ? "#fddc87" : "#fef0c6"

  async function handleDevolver() {
    await devolverLibro(libro.numeroInventario || "")
    onDevuelto()
  }

  const nroInv = libro.numeroInventario!.toString().startsWith('SN-') || !libro.numeroInventario ? 'S/N' : libro.numeroInventario

  return (
    <div
      className="flex items-center gap-2 rounded py-3 px-2"
      style={{ backgroundColor: bg }}
    >
      <span className={cn("text-lg", colNro, !numerosDeInventarioExternos && "hidden", )}>
        {nroInv}
      </span>
      <span className={cn("text-lg wrap-break-word", colTitulo)}>{libro.titulo}</span>
      <span className={cn("text-lg truncate", colAutor)}>{libro.autor}</span>
      <FechaPrestamo fechaDePrestamo={libro.fechaDePrestamo} />
      <div className={cn(colBtn, "pl-2.5")}>
        <button
          type="button"
          className="btn btn-icon p-2 md:px-4"
          onClick={handleDevolver}
        >
          <CheckIcon className="w-4 md:w-5" />
        </button>
      </div>
    </div>
  )
}
