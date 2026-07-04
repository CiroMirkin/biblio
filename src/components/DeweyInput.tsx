import type { KeyboardEvent } from "react"
import { getDeweyPorPaisYGenero, type LiteraryFormLabel } from "@shared/models"
import { formatName } from "@/utils"

interface Props {
  country: string
  genero: LiteraryFormLabel
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  inputClass: string
}

export function DeweyInput({ country, genero, value, onChange, onKeyDown, inputClass }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = () => {
    if (value !== "") return

    const sugerido = getDeweyPorPaisYGenero(formatName(country), genero)
    if (sugerido === null) return

    onChange(sugerido.toString())
  }

  return (
    <label className="flex flex-col gap-1 text-base">
      <span className="font-semibold">CDD:</span>
      <input
        onKeyDown={onKeyDown}
        onChange={handleChange}
        onFocus={handleFocus}
        step="0.01"
        min={100}
        type="number"
        name="dewey"
        id="dewey"
        value={value}
        className={inputClass}
      />
    </label>
  )
}
