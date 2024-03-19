import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "GanttResourceAllocator",
      fileName: "gantt-resource-allocator-lib",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: [ 
        "vue",
        "@imengyu/vue3-context-menu",
        "vue3-draggable-resizable",
    ],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
        "~": "/src",
        "assets": "/assets",
        "public": "/public",
        "#components": "/components"
    }
  }
})
