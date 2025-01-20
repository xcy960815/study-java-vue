import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
// @ts-ignore
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import router from '@/router'
import { registerGlobalComponents } from './components'
const app = createApp(App)
app.use(ElementPlus, {
  locale,
  // size: 'small',
  zIndex: 3000
})

app.use(registerGlobalComponents)
app.use(store)
app.use(router)
app.mount('#app')
