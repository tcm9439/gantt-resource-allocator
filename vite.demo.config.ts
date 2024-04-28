import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: '../gantt-resource-allocator-demo/',
    },
    experimental: {
        // github pages settings
        renderBuiltUrl(filename) {
            return '/gantt-resource-allocator/' + filename
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
