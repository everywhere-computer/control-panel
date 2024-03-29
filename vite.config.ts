import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true
  },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src'),
      $static: resolve('./static')
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5178,
    strictPort: false
  }
}

export default config
