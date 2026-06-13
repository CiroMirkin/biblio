interface props {
    value: boolean
    onChange: (value: boolean) => void
    labelOn: string
    labelOff: string
    name?: string
}

export function Toggle({
    value,
    onChange,
    labelOn,
    labelOff,
    name = "toggle",
}: props) {
    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    checked={value === true}
                    onChange={() => onChange(true)}
                    className="accent-accent w-4 h-4 shadow-none"
                />
                <span className="text-sm">{labelOn}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    checked={value === false}
                    onChange={() => onChange(false)}
                    className="accent-accent w-4 h-4 shadow-none"
                />
                <span className="text-sm">{labelOff}</span>
            </label>
        </div>
    )
}