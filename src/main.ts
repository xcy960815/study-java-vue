import './assets/style/main.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import store from './store'
import router from '@/router'
import { registerGlobalComponents } from './components'
const app = createApp(App)
app
  .use(registerGlobalComponents)
  .use(store)
  .use(router)
  .mount('#app')
