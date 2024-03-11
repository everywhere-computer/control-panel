import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true
  },
  plugins: [
    sveltekit(),
    wasm(),
    topLevelAwait(),
  ],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src'),
      $static: resolve('./static')
    }
  },
  server: {
    port: 5178,
    strictPort: false
  }
}

export default config
