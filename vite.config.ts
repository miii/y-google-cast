import { defineConfig } from 'vite'
import { resolve } from 'path'

import VuePlugin from '@vitejs/plugin-vue'
import ComponentsPlugin from 'unplugin-vue-components/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@miii/y-google-cast': resolve('src/index.ts'),
    },
  },
  plugins: [
    VuePlugin({
      template: {
        compilerOptions: {
          isCustomElement: compName => compName.startsWith('google'),
        },
      },
    }),
    ComponentsPlugin({
      dirs: ['playground'],
      dts: 'playground/components.d.ts',
    }),
  ],
})