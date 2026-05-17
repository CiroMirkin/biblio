import { cn } from "@/utils"
import { type ChangeEvent, type HTMLInputTypeAttribute, type SyntheticEvent } from "react"

type Props = {
  label: string
  placeholder?: string
  submitLabel?: string
  inputType?: HTMLInputTypeAttribute | undefined 
  defaultValue?: string | number
  onChange: (value: string) => void
  onSubmit?: () => void
  className?: string
}

export function Form({
  label,
  placeholder,
  submitLabel = "Buscar",
  onChange,
  onSubmit,
  className,
  inputType = "text",
  defaultValue,
}: Props) {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <form className={cn("w-full rounded p-4 card", className)} onSubmit={handleSubmit}>
      <label className="text-lg">{label}</label>
      <div className="mt-1 w-full flex gap-2">
        <input
          type={inputType}
          value={defaultValue || ""}
          onChange={handleChange}
          className="w-full border bg-white border-black rounded p-1 px-2"
          placeholder={placeholder}
        />
        <input type="submit" value={submitLabel} className="btn" />
      </div>
    </form>
  )
}