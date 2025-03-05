import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig((config) => {
  let base = undefined
  const env = loadEnv(config.mode, process.cwd())
  if (config.mode === 'production') {
    base = '/dist/'
  }
  return {
    base,
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: 'less', // css in js
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@resources': fileURLToPath(new URL('./src/assets/resources', import.meta.url)),
        '@SceneCore': fileURLToPath(new URL('./src/components/SceneCore', import.meta.url)),
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_PREFIX]: {
          target: `http://192.168.20.72`,
          changeOrigin: true,
          rewrite: (path) => path.replace(`/${env.VITE_APP_PREFIX}`, `/${env.VITE_APP_PREFIX}`),
        },
      },
    },
    define: {
      'process.env': env,
    },
  }
})
