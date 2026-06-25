import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, './shared'),
        },
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.spec.ts', 'tests/**/*.integrations.ts'],
        setupFiles: ['tests/setup.ts'],
        env: {
            IS_TEST: 'true',
        },
        typecheck: {
            tsconfig: './tsconfig.test.json',
        },
        coverage: {
            provider: 'v8',
            include: ['electron/**/*.ts'],
            exclude: ['electron/main.ts', 'electron/preload.ts'],
        },
        server: {
            deps: {
                inline: ['electron-store'],
                external: ['electron'],
            },
        },
    },
})