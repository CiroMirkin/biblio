import { CheckIcon } from "@/components"
import { AnimatePresence, motion } from "motion/react"

export function CheckExito({ exito }: { exito: boolean }) {
  return (
    <AnimatePresence>
      {exito && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="size-8 grid place-items-center rounded-full bg-greem text-white"
        >
          <CheckIcon size={20} />
        </motion.span>
      )}
    </AnimatePresence>
  )
}
