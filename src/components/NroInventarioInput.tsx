import { useLibrosStore } from "@/store"
import { isValidNumeroInventario } from "@shared/models"
import { useState, type KeyboardEvent } from "react"
import { Toggle } from "./Toggle"

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
  const [esLibroNuevo, setEsLibroNuevo] = useState<boolean>(false)
  const [nro, setNro] = useState<string>(
    mode === "edicion" ? String(defaultValue ?? "") : ""
  )
  const [ error, setMensajeDeError ] = useState<string[] | null>(null)
  const { esNroInventarioExistente } = useLibrosStore()

  const handleChangeNro = (valor: string) => {
    setNro(valor)

    if(valor === "" || valor === "0") {
      setMensajeDeError(["El N° de inventario es requerido,", "no puede faltar."])
      onNroInvalid(true)
      return
    }

    if(!isValidNumeroInventario(valor)) {
      onNroInvalid(true)
      setMensajeDeError(["El N° es invalido,", "el sistema solo gestiona N° menores a 100 mil."])
      return
    }

    const { libro, existente } = esNroInventarioExistente(valor)
    if (existente && libro !== null) {
      const autor = libro.autor ? `de ${libro.autor}.` : "."
      setMensajeDeError([
        `El N° ${libro.numeroInventario} ya esta registrado en el libro`,
        `"${libro.titulo}" ${autor}`
      ])
      setEsLibroNuevo(false)
      onNroInvalid(true)
      return
    }

    setEsLibroNuevo(true)
    onNroInvalid(false)
    setMensajeDeError(null)
  }

  const handleToggle = (esNuevo: boolean) => {
    setEsLibroNuevo(esNuevo)
    setMensajeDeError(null)

    if (esNuevo) {
      const valorSugerido = String(defaultValue ?? "")
      setNro(valorSugerido)
      onNroInvalid(valorSugerido === "")
    } else {
      setNro("")
      onNroInvalid(true)
    }
  }

  return (
    <div className="mb-4 grid grid-cols-2 gap-x-4 items-center">
      <label className="flex flex-col gap-1 text-base">
        <span className="flex gap-1 items-end font-semibold">
          N° de inventario: { mode === "ingreso" && <span className="text-red">*</span> }
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
          value={nro}
          className={inputClass}
          maxLength={5}
          required={mode === "ingreso"}
        />
      </label>
      { mode === "ingreso" &&
        <div className="pt-4">
          <Toggle
            labelOn="Libro nuevo."
            labelOff="Libro existente."
            value={esLibroNuevo}
            onChange={handleToggle}
            name="nro-nuevo-viejo"
          />
        </div>
      }
    </div>
  )
}
