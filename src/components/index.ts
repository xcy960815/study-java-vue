/**
 * 注册全局组件
 */
import HandleTooBar from './handle-toolbar/index.vue'
import Icon from './icon/index.vue'

/**
 * 统一注册全局组件
 */
export const registerGlobalComponents = {
  install: (app: import('vue').App<Element>): void => {
    // HandleTooBar 组件
    app.component(HandleTooBar.name!, HandleTooBar)
    // Icon 组件
    app.component(Icon.name!, Icon)
    // element-plus 图标
    // for (const [key, component] of Object.entries(ElIcon)) {
    //   app.component(key, component)
    // }
    // icon-park 图标
    // for (const [key, component] of Object.entries(IconPark)) {
    //   app.component(key, component)
    // }
  },
}
