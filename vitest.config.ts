import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://github.com/temporalio/ui/blob/main/vitest.config.ts
export default defineConfig({
     plugins: [
        vue(),
    ],
    root: '.',
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '~test': path.resolve(__dirname, 'test'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
})