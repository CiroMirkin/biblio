import { cn } from "@/utils"
import { type ChangeEvent, type HTMLInputTypeAttribute, type ReactNode, type SyntheticEvent, useEffect, useRef, useState } from "react"

type Props = {
  label: string
  placeholder?: string
  submitLabel?: ReactNode | string
  inputType?: HTMLInputTypeAttribute | undefined
  defaultValue?: string | number
  min?: number
  withSubmit?: boolean
  textarea?: boolean
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
  classNameInput?: string
  classNameBtn?: string
  classNameLabel?: string
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
  classNameBtn,
  classNameInput,
  classNameLabel,
  min,
  textarea = false,
  withSubmit = true,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? "")
  const [prevDefault, setPrevDefault] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  if (prevDefault !== defaultValue) {
    setPrevDefault(defaultValue)
    setValue(defaultValue ?? "")
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit?.(value.toString())
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <form className={cn("w-full rounded p-4 card", className)} onSubmit={handleSubmit}>
      <label className={cn("text-lg", classNameLabel)}>{label}</label>
      <div className="mt-1 w-full flex gap-2">
        {textarea ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            className={cn("w-full border bg-white border-black rounded p-1 px-2 resize-none overflow-hidden", classNameInput)}
            placeholder={placeholder}
            rows={1}
          />
        ) : (
          <input
            type={inputType}
            value={value}
            onChange={handleChange}
            className={cn("w-full border bg-white border-black rounded p-1 px-2", classNameInput)}
            placeholder={placeholder}
            min={min}
          />
        )}
        { withSubmit && (
          <button type="submit"className={cn("btn", classNameBtn)}>
            { submitLabel }
          </button>
        ) }
      </div>
    </form>
  )
}