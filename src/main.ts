import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import * as ElIcon from '@element-plus/icons-vue'
import store from './store'

// 你好你还哦啊
// @ts-ignore
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import router from '@/router'

const app = createApp(App)
app.use(ElementPlus, {
  locale,
  size: 'small',
  zIndex: 3000
})
Object.keys(ElIcon).forEach((key) => {
  app.component(key, ElIcon[key as keyof typeof ElIcon])
})

app.use(store)
app.use(router)
app.mount('#app')
