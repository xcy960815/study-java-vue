/**
 * 该文件作用是修改系统主题颜色
 */
import { render, createVNode } from 'vue'
import { svg2bese64 } from '@utils/svg2base64'
import { type FormInstance } from 'element-plus'
import { reactive, ref, nextTick } from 'vue'
import { type RouteLocationNormalizedGeneric } from 'vue-router'
import * as iconPark from '@icon-park/vue-next'
import { merge } from 'lodash'
import { genMixColor } from './generate-color'
import { useDark } from '@vueuse/core'

/**
 * CSS 变量键名
 */
export const CSS_VARIABLES = {
  LAYOUT_SIDE_CONTAINER_WIDTH: '--layout-side-container-width',
} as const

/**
 * 本地存储键名
 */
const STORAGE_KEYS = {
  SYSTEM_THEME_COLOR: 'system-theme-color',
} as const

/**
 * 主题配置类型
 */
export interface Theme {
  colors: {
    primary?: string
    info?: string
    warning?: string
    success?: string
    danger?: string
  }
}

/**
 * 默认主题配置
 */
const DEFAULT_THEME: Theme = {
  colors: {
    primary: '#409EFF',
    info: '#909399',
    warning: '#E6A23C',
    danger: '#F56C6C',
    success: '#67C23A',
  },
}

/**
 * 设置 CSS 变量
 */
export function setStyleProperty(propName: string, value: string): void {
  document.documentElement.style.setProperty(propName, value)
}

/**
 * 系统主题管理
 */
export const useSystemTheme = () => {
  const isDark = useDark()
  const themeConfig = reactive<Theme>(Object.assign({}, getTheme()))
  const themeDialogVisible = ref(false)
  const themeFormRef = ref<FormInstance>()

  /**
   * 获取主题配置
   */
  function getTheme(): Theme {
    const theme = localStorage.getItem(STORAGE_KEYS.SYSTEM_THEME_COLOR)
    return theme ? JSON.parse(theme) : DEFAULT_THEME
  }

  /**
   * 更新品牌扩展颜色变量
   */
  function updateBrandExtendColorsVar(color: string, name: string): void {
    const { DEFAULT, dark, light } = genMixColor(color, isDark.value)

    // 设置主题色变量
    const colorVars = {
      [`--${name}-lighter-color`]: light[5],
      [`--${name}-light-color`]: light[3],
      [`--${name}-color`]: DEFAULT,
      [`--${name}-deep-color`]: dark[2],
      [`--${name}-deeper-color`]: dark[4],
      [`--el-color-${name}`]: DEFAULT,
      [`--el-color-${name}-dark-2`]: dark[2],
      [`--el-color-${name}-light-3`]: light[3],
      [`--el-color-${name}-light-5`]: light[5],
      [`--el-color-${name}-light-7`]: light[7],
      [`--el-color-${name}-light-8`]: light[8],
      [`--el-color-${name}-light-9`]: light[9],
    }

    Object.entries(colorVars).forEach(([key, value]) => {
      setStyleProperty(key, value)
    })
  }

  /**
   * 更新主题色变量
   */
  function updateThemeColorVar({ colors }: Theme): void {
    Object.entries(colors).forEach(([brand, color]) => {
      if (color) {
        updateBrandExtendColorsVar(color, brand)
      }
    })
  }

  /**
   * 设置主题
   */
  function setTheme(data: Theme = DEFAULT_THEME): void {
    const oldTheme = getTheme()
    const newTheme = merge(oldTheme, data)

    localStorage.setItem(STORAGE_KEYS.SYSTEM_THEME_COLOR, JSON.stringify(newTheme))
    updateThemeColorVar(newTheme)
  }

  /**
   * 初始化主题
   */
  function initTheme(): void {
    setTheme(getTheme())
  }

  /**
   * 确认主题更改
   */
  function handleConfirmTheme(): void {
    setTheme(themeConfig)
    localStorage.setItem(STORAGE_KEYS.SYSTEM_THEME_COLOR, JSON.stringify(themeConfig))
    themeDialogVisible.value = false
  }

  /**
   * 打开主题设置对话框
   */
  function handleClickChangeThemeColor(): void {
    themeDialogVisible.value = true
    nextTick(() => {
      themeFormRef.value?.resetFields()
    })
  }

  /**
   * 切换暗黑模式
   */
  function handleClickChangeTheme(): void {
    isDark.value = !isDark.value
  }

  /**
   * 重置主题设置
   */
  function resetTheme(): void {
    themeFormRef.value?.resetFields()
  }

  return {
    isDark,
    themeConfig,
    initTheme,
    handleConfirmTheme,
    handleClickChangeThemeColor,
    handleClickChangeTheme,
    themeDialogVisible,
    themeFormRef,
    resetTheme,
  }
}

/**
 * 修改浏览器标签页标题
 */
export const changeTabTitle = (title: string): void => {
  document.title = title
}

/**
 * 设置浏览器标签页图标
 */
export const setTabIcon = (iconPath: string): void => {
  if (!iconPath) return

  let linkElement = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
  if (!linkElement) {
    linkElement = document.createElement('link')
    document.head.appendChild(linkElement)
  }

  Object.assign(linkElement, {
    type: 'image/x-icon',
    rel: 'shortcut icon',
    href: iconPath,
  })
}

/**
 * 根据路由更新标签页图标
 */
export const changeTabIcon = (to: RouteLocationNormalizedGeneric): void => {
  const icon = iconPark[to.meta.icon as keyof typeof iconPark] || iconPark.System
  const size = 16
  const vnode = createVNode(icon, { theme: 'outline', size, fill: '#333' })
  const container = document.createElement('div')

  render(vnode, container)

  const svg = container.querySelector<SVGElement>('svg')
  if (svg) {
    setTabIcon(svg2bese64(svg))
  }
}
