import { fileURLToPath, URL } from 'node:url'
import {
  type PreRenderedAsset,
  type PreRenderedChunk
} from 'rollup'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
/**
 * @type {import('vite').UserConfig}
 * @link https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
  /** 端口号 */
  const VITE_PORT = parseInt(
    loadEnv(mode, './env/').VITE_PORT
  )

  /** 后端接口 */
  const VITE_API_SERVER_DOMAIN = loadEnv(
    mode,
    './env/'
  ).VITE_API_SERVER_DOMAIN

  /** 后端接口前缀 */
  const VITE_API_SERVER_DOMAIN_PREFIX = loadEnv(
    mode,
    './env/'
  ).VITE_API_SERVER_DOMAIN_PREFIX

  /** 前端代理接口前缀 */
  const VITE_API_DOMAIN_PREFIX = loadEnv(
    mode,
    './env/'
  ).VITE_API_DOMAIN_PREFIX

  /** 前端搭理接口前缀正则 */
  const VITE_API_DOMAIN_PREFIX_REG = new RegExp(
    `^${VITE_API_DOMAIN_PREFIX}`
  )

  /** 静态资源地址 */
  const VITE_BASE_URL = loadEnv(
    mode,
    './env/'
  ).VITE_BASE_URL

  /** Html tab title */
  const VITE_APP_TITLE = loadEnv(
    mode,
    './env/'
  ).VITE_APP_TITLE

  return {
    base: VITE_BASE_URL,
    envDir: './env', // 环境变量目录 若不设置会在 import.meta.env 中取不到变量
    build: {
      chunkSizeWarningLimit: 1024, // 将警告体积变成1MB
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) {
                // lodash 单独打包
                return 'lodash'
              }
              if (id.includes('@element-plus/icons-vue')) {
                // 单独拆分 element-plus/icons-vue
                return 'icons-vue'
              }
              if (id.includes('@icon-park/vue-next')) {
                // 单独拆分 icon-park
                return 'icon-park'
              }
              if (id.includes('axios')) {
                // axios 单独打包
                return 'axios'
              }
              if (id.includes('gpt3-tokenizer')) {
                // gpt3-tokenizer 单独打包
                return 'gpt3-tokenizer'
              }
              if (id.includes("katex")) {
                // katex 单独打包
                return 'katex'
              }
              if (id.includes("highlight")) {
                // highlight 单独打包
                return 'highlight'
              }
              if (id.includes('element-plus')) {
                // element-plus 单独打包
                return 'element-plus'
              }
              if (id.includes('vue')) {
                // vue 单独打包
                return 'vue'
              }
              if (id.includes('gpt-tokenizer')) {
                // gpt-tokenizer 单独打包
                return 'gpt-tokenizer'
              }
              return 'vendor' // 其他库放在 vendor.js 里
            }
          },
          // 入口文件输出配置
          entryFileNames: `assets/js/[name]-[format]-[hash].js`,
          // 代码引入文件输出配置
          chunkFileNames(chunkInfo: PreRenderedChunk) {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const facadeModuleIds =
                facadeModuleId.split('/')
              const parentname =
                facadeModuleIds[facadeModuleIds.length - 2]
              return `assets/js/${parentname}-[name]-[hash].js`
            }
            return `assets/js/[name]-[hash].js`
          },
          // 静态资源输出配置
          assetFileNames(assetInfo: PreRenderedAsset) {
            const name = assetInfo.name
            const originalFileName =
              assetInfo.originalFileName
            const imgSuffixs = [
              '.png',
              '.jpg',
              '.jpeg',
              '.gif',
              '.svg',
              '.webp'
            ]
            if (originalFileName) {
              const originalFileNames =
                originalFileName.split('/')
              const parentname =
                originalFileNames[
                originalFileNames.length - 2
                ]
              // css文件单独输出到css文件夹
              if (name?.endsWith('.css')) {
                return `assets/css/${parentname ? parentname + '-' : ''
                  }[name]-[hash].css`
              }
              // 图片文件单独输出到img文件夹
              else if (
                imgSuffixs.some((ext) =>
                  name?.endsWith(ext)
                )
              ) {
                return `assets/img/${parentname ? parentname + '-' : ''
                  }[name}]-[hash].[ext]`
              }
              // 其他资源输出到assets文件夹
              else {
                return `assets/${parentname ? parentname + '-' : ''
                  }[name]-[hash].[ext]`
              }
            } else {
              // css文件单独输出到css文件夹
              if (name?.endsWith('.css')) {
                return `assets/css/[name]-[hash].css`
              }
              // 图片文件单独输出到img文件夹
              else if (
                imgSuffixs.some((ext) =>
                  name?.endsWith(ext)
                )
              ) {
                return `assets/img/[name}]-[hash].[ext]`
              }
              // 其他资源输出到assets文件夹
              else {
                return `assets/[name]-[hash].[ext]`
              }
            }
          }
        }
      }
    },
    logLevel: 'info',
    server: {
      // host: '0.0.0.0', // 确保服务监听所有网络接口
      host: true,
      port: VITE_PORT,
      proxy: {
        [VITE_API_DOMAIN_PREFIX]: {
          target: VITE_API_SERVER_DOMAIN,
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
            path.replace(
              VITE_API_DOMAIN_PREFIX_REG,
              VITE_API_SERVER_DOMAIN_PREFIX
            )
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
          // additionalData: `@use "@assets/style/element/theme.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      vueDevTools(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE,
            VITE_BASE_URL
          }
        }
      }),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            // importStyle: 'sass'
          })
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            // importStyle: 'sass'
          })
        ]
      }),
      ElementPlus({
        useSource: true
      }),
      // 注册所有的svg文件生成svg雪碧图
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(
            process.cwd(),
            'src/assets/svg-icons'
          )
        ], // icon存放的目录
        symbolId: 'icon-[name]', // symbol的id
        inject: 'body-last', // 插入的位置
        customDomId: '__svg__icons__dom__' // svg的id
      }),
      // 打包体积分析
      visualizer({
        // open: true,
        filename: 'visualizer.html' //分析图生成的文件名
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
        ),
        '@enums': fileURLToPath(
          new URL('./src/enums', import.meta.url)
        ),
        '@plugins': fileURLToPath(
          new URL('./src/plugins', import.meta.url)
        ),
        // '@types': fileURLToPath(
        //   new URL('./types', import.meta.url)
        // )
      }
    }
  }
})
