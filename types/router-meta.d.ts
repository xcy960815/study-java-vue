import { localIcons } from '@assets/svg-icons/index'

import * as ElIcons from '@element-plus/icons-vue'

import * as IconParkIcons from "@icon-park/vue-next"

declare module 'vue-router' {

  type ElIconNames = keyof typeof ElIcons

  type IconParkNames = keyof typeof IconParkIcons

  type LocalIconNames = keyof typeof localIcons


  interface RouteMeta {
    title?: string
    permission?: string | Array<string>
    link?: string
    hidden?: boolean
    icon?:  Exclude<IconParkNames, "IconProvider" | "DEFAULT_ICON_CONFIGS"> | LocalIconNames // | ElIconName
    keepAlive?: boolean
  }
}

export { }
