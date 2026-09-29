import { cn } from "@/utils"
import { colBtn } from "./types"

interface Props {
  value: string
  onChange: (value: string) => void
  onEnter: () => void
  inputRef: (el: HTMLInputElement | null) => void
}

export function InputFechaPrestamo({ value, onChange, onEnter, inputRef }: Props) {
  return (
    <input
      type="date"
      ref={inputRef}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(colBtn, "w-35 border bg-white border-black rounded p-1 px-2")}
      onKeyDown={e => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        onEnter()
      }}
    />
  )
}
