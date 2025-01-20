/**
 * 注册全局组件
 */
import HandleTooBar from './handle-toolbar/index.vue'
import * as ElIcon from '@element-plus/icons-vue'

export const registerGlobalComponents = {
  install: (app: import('vue').App<Element>): void => {
    app.component(HandleTooBar.name!, HandleTooBar)
    Object.keys(ElIcon).forEach((key) => {
      app.component(key, ElIcon[key as keyof typeof ElIcon])
    })
  }
}
