import { vi } from 'vitest'

vi.mock('electron', () => ({
    app: { getPath: () => '/tmp' },
}))
