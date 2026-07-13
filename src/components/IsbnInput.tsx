import { formatISBN } from "@shared/utils"
import type { ChangeEvent, KeyboardEvent } from "react"

function nextDigitsOnHyphenatedChange(prevFormatted: string, newRaw: string): string {
    let next = newRaw
    if (next.length < prevFormatted.length) {
        let i = 0
        while (i < next.length && next[i] === prevFormatted[i]) i++
        if (prevFormatted[i] === "-") {
            next = next.slice(0, i) + next.slice(i + 1)
        }
    }
    return next.replace(/-/g, "")
}

interface Props {
    value?: string
    onChange: (value: string) => void
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    inputClass: string
}

export function IsbnInput({ value = "", inputClass, onKeyDown, onChange }: Props) {
    const formatted = formatISBN(value)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(nextDigitsOnHyphenatedChange(formatted, e.target.value))
    }

    return (
        <label className="flex flex-col gap-1 text-base">
            <span className="font-semibold">Código de barras (ISBN):</span>
            <input
                onKeyDown={onKeyDown}
                type="text"
                name="barcode"
                id="barcode"
                minLength={8}
                value={formatted}
                onChange={handleChange}
                className={inputClass} />
        </label>
    )
}