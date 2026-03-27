import { computed } from 'vue'
import { useUserInfoStore } from '@store'

type PermissionInput = string | string[]

const ALL_PERMISSION = '*:*:*'

const normalizePermissions = (value: PermissionInput): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => !!item)
  }
  return value ? [value] : []
}

const includesPermission = (ownedPermissions: string[], requiredPermissions: string[]) => {
  if (requiredPermissions.length === 0) {
    return false
  }
  if (ownedPermissions.includes(ALL_PERMISSION)) {
    return true
  }
  return requiredPermissions.some((permission) => ownedPermissions.includes(permission))
}

export const hasPermission = (value: PermissionInput) => {
  const userInfoStore = useUserInfoStore()
  return includesPermission(userInfoStore.getPermissions, normalizePermissions(value))
}

export const hasAllPermissions = (value: PermissionInput) => {
  const userInfoStore = useUserInfoStore()
  const requiredPermissions = normalizePermissions(value)
  if (requiredPermissions.length === 0) {
    return false
  }
  if (userInfoStore.getPermissions.includes(ALL_PERMISSION)) {
    return true
  }
  return requiredPermissions.every((permission) =>
    userInfoStore.getPermissions.includes(permission)
  )
}

export const usePermission = () => {
  const userInfoStore = useUserInfoStore()

  return {
    permissions: computed(() => userInfoStore.getPermissions),
    hasPermi: hasPermission,
    hasAnyPermi: hasPermission,
    hasAllPermi: hasAllPermissions,
  }
}
