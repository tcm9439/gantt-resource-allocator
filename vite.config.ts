import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'GanttResourceAllocator',
            fileName: 'gantt-resource-allocator-lib',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled into your library
            external: ['vue', '@imengyu/vue3-context-menu', 'vue3-draggable-resizable', 'default-passive-events'],
            output: {
                // Provide global variables to use in the UMD build for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            assets: path.resolve(__dirname, 'assets'),
            public: path.resolve(__dirname, 'public'),
            '#components': path.resolve(__dirname, 'components'),
        },
    },
})
