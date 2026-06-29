import { useLibrosStore } from "@/store"
import { isValidNumeroInventario } from "@shared/models"
import { useState, type KeyboardEvent } from "react"

interface Props {
  mode: "ingreso" | "edicion"
  defaultValue?: string | number
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  inputClass?: string
  onNroInvalid?: (isValid: boolean) => void
}

export function NroInventarioInput({
  mode, defaultValue, onKeyDown, inputClass = "", onNroInvalid = () => {},
}: Props) {
  const [esLibroNuevo, setEsLibroNuevo] = useState<boolean>(
    mode === "ingreso" && defaultValue !== ""
  )
  const [ error, setMensajeDeError ] = useState<string[] | null>(null)
  const { esNroInventarioExistente } = useLibrosStore()

  const handleChangeNro = (nro: string) => {
    if(nro === "" || nro === "0") {
      setMensajeDeError(["El N° de inventario es requerido,", "no puede faltar."])
      onNroInvalid(true)
      return
    }

    if(!isValidNumeroInventario(nro)) {
      onNroInvalid(true)
      setMensajeDeError(["El N° es invalido,", "el sistema solo gestiona N° menores a 100 mil."])
      return
    }
    
    const { libro, existente } = esNroInventarioExistente(nro)
    if (existente && libro !== null) {
      const autor = libro.autor ? `de ${libro.autor}.` : "."
      setMensajeDeError([
        `El N° ${libro.numeroInventario} ya esta registrado en el libro`,
        `"${libro.titulo}" ${autor}`
      ])
      onNroInvalid(true)
      return
    }
    
    setEsLibroNuevo(false)
    onNroInvalid(false)
    setMensajeDeError(null)
  }

  return (
    <label className="flex flex-col gap-1 text-base">
      <span className="flex gap-1 items-end font-semibold">
        N° de inventario
        <span className="text-sm">
          ({esLibroNuevo ? "Libro nuevo" : "Libro existente"})
        </span>
        :
      </span>
      { error !== null && (
        <span className="text-lg font-semibold text-red flex gap-x-1.5 flex-wrap">
          { error.map(e => <span key={e}>{e}</span>) }
        </span>
      ) }

      <input
        onKeyDown={onKeyDown}
        onChange={(e) => handleChangeNro(e.target.value)}
        type="text"
        name="numeroInventario"
        id="numeroInventario"
        defaultValue={defaultValue ?? ""}
        className={inputClass}
        maxLength={5}
      />
    </label>
  )
}
