import type { App, DirectiveBinding } from 'vue'
import { hasAllPermissions, hasPermission } from '@/composables/usePermission'

const PERMISSION_ERROR_MESSAGE = '请设置操作权限标签值'

const updateElementVisibility = (el: HTMLElement, visible: boolean) => {
  if (!visible) {
    if (el.dataset.permissionDisplay === undefined) {
      el.dataset.permissionDisplay = el.style.display || ''
    }
    el.style.display = 'none'
    return
  }

  if (el.dataset.permissionDisplay !== undefined) {
    el.style.display = el.dataset.permissionDisplay
    delete el.dataset.permissionDisplay
    return
  }

  el.style.removeProperty('display')
}

const checkPermission = (binding: DirectiveBinding) => {
  const { value, modifiers } = binding
  if (!value || (Array.isArray(value) && value.length === 0)) {
    throw new Error(PERMISSION_ERROR_MESSAGE)
  }

  if (modifiers.all) {
    return hasAllPermissions(value)
  }

  return hasPermission(value)
}

/**
 * 按钮权限校验指令
 * 使用方法：v-hasPermi="['system:user:add']"
 */
const hasPermi = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    updateElementVisibility(el, checkPermission(binding))
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    updateElementVisibility(el, checkPermission(binding))
  },
}

export default {
  install(app: App) {
    app.directive('hasPermi', hasPermi)
  },
}
