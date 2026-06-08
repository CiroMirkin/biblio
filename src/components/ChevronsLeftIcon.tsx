import type { IconProps } from "./IconProps"

export function ChevronsLeftIcon({ size = 24, ...props }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevrons-left-icon lucide-chevrons-left" {...props}>
            <path d="m11 17-5-5 5-5"/>
            <path d="m18 17-5-5 5-5"/>
        </svg>
    )
}
