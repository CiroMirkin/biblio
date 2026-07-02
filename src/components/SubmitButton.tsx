import type { ReactNode } from "react"
import { CheckIcon, Spinner } from "@/components"
import { motion } from "motion/react"
import { cn } from "@/utils"

type Props = {
  type?: "submit" | "button"
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  success?: boolean
  className?: string
  iconSize?: number
  iconClassName?: string
  children: ReactNode
}

export function SubmitButton({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  success = false,
  className,
  iconSize = 20,
  iconClassName = "pt-0.5 text-[#fff]",
  children,
}: Props) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      animate={{
        backgroundColor: success ? "#00a63e" : "",
        color: success ? "#fff" : "",
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn("flex items-center justify-center gap-2", isDisabled && "btn-disabled", className)}
    >
      { success && <CheckIcon size={iconSize} className={iconClassName} /> }
      { loading && <Spinner /> }
      { children }
    </motion.button>
  )
}
