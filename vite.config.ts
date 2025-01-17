import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const VITE_PORT = parseInt(
    loadEnv(mode, './env/').VITE_PORT
  )
  const VITE_API_DOMAIN = loadEnv(
    mode,
    './env/'
  ).VITE_API_DOMAIN //'http://localhost:8081'

  const VITE_API_DOMAIN_PREFIX = loadEnv(
    mode,
    './env/'
  ).VITE_API_DOMAIN_PREFIX // '/dev_api'

  const VITE_API_DOMAIN_PREFIX_REG = new RegExp(
    `^${VITE_API_DOMAIN_PREFIX}`
  )
  const VITE_BASE_URL = loadEnv(
    mode,
    './env/'
  ).VITE_BASE_URL

  const VITE_APP_TITLE = loadEnv(
    mode,
    './env/'
  ).VITE_APP_TITLE

  return {
    base: VITE_BASE_URL,
    envDir: './env', // 环境变量目录 不设置会在 import.meta.env 中取不到变量
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'element-plus']
          }
        }
      }
    },
    logLevel: 'info',
    server: {
      port: VITE_PORT,
      proxy: {
        [VITE_API_DOMAIN_PREFIX]: {
          target: VITE_API_DOMAIN,
          changeOrigin: true,
          ws: true,
          // 该配置会将真是的代理地址显示在 network 自定义请求头中
          bypass(req, res, options) {
            const proxyURL =
              new URL(
                options.rewrite!(req.url || '') || '',
                options.target as string
              )?.href || ''
            res.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
          },
          rewrite: (path) =>
            path.replace(VITE_API_DOMAIN_PREFIX_REG, '/api')
        }
      }
    },
    plugins: [
      vue(),
      vueDevTools(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(
          new URL('./src', import.meta.url)
        ),
        '@utils': fileURLToPath(
          new URL('./src/utils', import.meta.url)
        ),
        '@assets': fileURLToPath(
          new URL('./src/assets', import.meta.url)
        ),
        '@apis': fileURLToPath(
          new URL('./src/apis', import.meta.url)
        ),
        '@store': fileURLToPath(
          new URL('./src/store', import.meta.url)
        ),
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
        '@router': fileURLToPath(
          new URL('./src/router', import.meta.url)
        )
      }
    }
  }
})
