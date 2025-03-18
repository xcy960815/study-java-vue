/**
 * 注册全局组件
 */
import HandleTooBar from './handle-toolbar/index.vue'
import SvgIcon from './svg-icon/index.vue'
import * as ElIcon from '@element-plus/icons-vue'
import * as IconParkAll from "@icon-park/vue-next";

const { IconProvider, DEFAULT_ICON_CONFIGS, ...IconPark } = IconParkAll


/**
 * 统一注册全局组件
 */
export const registerGlobalComponents = {
  install: (app: import('vue').App<Element>): void => {
    // HandleTooBar 组件
    app.component(HandleTooBar.name!, HandleTooBar)
    // SvgIcon 组件
    app.component(SvgIcon.name!, SvgIcon)
    // element-plus 图标
    for (const [key, component] of Object.entries(ElIcon)) {
      app.component(key, component)
    }
    // icon-park 图标
    for (const [key, component] of Object.entries(IconPark)) {
      app.component(key, component)
    }
  }
}
