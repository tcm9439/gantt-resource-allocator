import path from 'path'
import { defineConfig } from 'vite'

// https://github.com/temporalio/ui/blob/main/vitest.config.ts
export default defineConfig({
    root: '.',
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '~test': path.resolve(__dirname, 'test'),
        },
    },
})