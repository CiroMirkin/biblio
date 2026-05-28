import { ipcMain } from 'electron'
import * as settings from '../settings'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:getAll', () => {
    return settings.getAll()
  })

  ipcMain.handle('settings:get', (_event, key: string) => {
    return settings.get(key as keyof ReturnType<typeof settings.getAll>)
  })

  ipcMain.handle('settings:set', (_event, key: string, value: unknown) => {
    settings.set(key as keyof ReturnType<typeof settings.getAll>, value as number)
  })
}
