/**
 * 注册全局组件
 */
import HandleTooBar from './handle-toolbar/index.vue'
import SvgIcon from './svg-icon/index.vue'
import * as ElIcon from '@element-plus/icons-vue'

/**
 * 统一注册全局组件
 */
export const registerGlobalComponents = {
  install: (app: import('vue').App<Element>): void => {
    app.component(HandleTooBar.name!, HandleTooBar)
    app.component(SvgIcon.name!, SvgIcon)
    // element-plus 图标
    for (const [key, component] of Object.entries(ElIcon)) {
      app.component(key, component)
    }
  }
}
