import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.spec.ts'],
        setupFiles: ['tests/setup.ts'],
        typecheck: {
            tsconfig: './tsconfig.test.json',
        },
        coverage: {
            provider: 'v8',
            include: ['electron/**/*.ts'],
            exclude: ['electron/main.ts', 'electron/preload.ts'],
        },
    },
})