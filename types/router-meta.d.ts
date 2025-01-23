import { svgIcons } from '@assets/svg-icons/index'

import * as ElIcon from '@element-plus/icons-vue'

declare module 'vue-router' {
  type ElIconName = keyof typeof ElIcon

  type SvgIconName = (typeof svgIcons)[number]

  interface RouteMeta {
    title?: string
    permission?: string | Array<string>
    link?: string
    hidden?: boolean
    icon?: SvgIconName | ElIconName
    keepAlive?: boolean
  }
}

export {}
