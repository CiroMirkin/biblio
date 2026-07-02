import { countryToPrefix, cutterFromAuthor, normalizeCallNumber } from "@shared/models"
import { cn } from "@/utils"

interface Props {
  mode: "ingreso" | "edicion"
  autor: string
  country: string
  dewey: string
  defaultValue?: string
  inputClass: string
}

export function CallNumberInput({ mode, autor, country, dewey, defaultValue, inputClass }: Props) {
  const tieneValorExistente = !!defaultValue
  const autocompletar = mode === "ingreso" || !tieneValorExistente

  const value = dewey
    ? normalizeCallNumber(`${countryToPrefix(country)} ${dewey} ${cutterFromAuthor(autor)}`)
    : ""

  return (
    <label className={cn("flex flex-col gap-1 text-base", autocompletar && "opacity-50 font-semibold")}>
      <span className="font-semibold">Signatura:</span>
      <input
        step="0.01"
        min={100}
        type="text"
        disabled={autocompletar}
        readOnly={autocompletar}
        name="callNumber"
        id="callNumber"
        value={autocompletar ? value : undefined}
        defaultValue={autocompletar ? undefined : defaultValue}
        className={inputClass}
      />
    </label>
  )
}