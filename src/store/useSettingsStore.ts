import { create } from "zustand"
import { settingsService } from "@/services"
import type { Settings } from "@/services/settingsService"

interface SettingsState extends Settings {
  inicializar: () => Promise<void>
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  toggleSetting: <K extends keyof Settings>(key: K) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  limiteDeDias: 40,
  maximoLibrosEnPrestamo: 4,
  maximoDeCuotasAdeudadas: 6,
  fechaDePrestamoAutomatica: true,
  precioCuota: 1000,
  gestionDeCuotas: true,

  inicializar: async () => {
    const settings = await settingsService.getAll()
    set(settings)
  },

  updateSetting: (key, value) => {
    settingsService.set(key, value)
    set({ [key as string]: value } as Partial<SettingsState>)
  },

  toggleSetting: (key) => {
    const current = get()[key]
    if (typeof current !== "boolean") return
    const next = !current
    settingsService.set(key as keyof Settings, next as Settings[typeof key])
    set({ [key as string]: next } as Partial<SettingsState>)
  },
}))
