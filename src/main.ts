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
