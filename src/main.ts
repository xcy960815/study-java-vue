import './assets/style/main.css'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import './assets/styles/theme.scss';
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import store from './store'
import router from '@/router'
import { registerGlobalComponents } from './components'
import { simulateLoadingProgress } from './utils/loading-progress'
import { startTokenKeepAlive } from './utils/token-keepalive'
import permission from './plugins/permission'

// 开始模拟加载进度
simulateLoadingProgress()

const app = createApp(App)
app
  // .use(ElementPlus)
  .use(registerGlobalComponents)
  .use(store)
  .use(permission)
  .use(router)
  .mount('#app')

// 应用启动即挂载 Token 保活定时器（未登录时空转，登录后自动生效）
startTokenKeepAlive()
