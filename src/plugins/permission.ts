import type { App, DirectiveBinding } from 'vue'
import { useUserInfoStore } from '@/store'

/**
 * 按钮权限校验指令
 * 使用方法：v-hasPermi="['system:user:add']"
 */
const hasPermi = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserInfoStore()
    const permissions = userStore.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission) => {
        return permission === '*:*:*' || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  },
}

export default {
  install(app: App) {
    app.directive('hasPermi', hasPermi)
  },
}
