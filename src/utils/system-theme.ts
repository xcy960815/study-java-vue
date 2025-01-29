/** 该文件作用是修改系统主题颜色 */

import { type FormInstance } from 'element-plus'
import { reactive, ref, nextTick } from 'vue'
import { type RouteLocationNormalizedGeneric } from 'vue-router'

import { merge } from 'lodash-es'
import { genMixColor } from './generate-color'
import { useDark } from '@vueuse/core'

/**
 * 侧边栏宽度key
 */
export const LAYOUTSIDECONTAINERWIDTHKEY =
  '--layout-side-container-width'

/**
 * 系统主题key
 */
const SYSTEMTHEMECOLORKEY = 'system-theme-color'

// 设置css变量
export function setStyleProperty(
  propName: string,
  value: string
) {
  document.documentElement.style.setProperty(
    propName,
    value
  )
}

export type Theme = {
  colors: {
    primary?: string
    info?: string
    warning?: string
    success?: string
    danger?: string
  }
}
/**
 * 设置系统主题
 * @returns
 */
export const setSystemTheme = () => {
  const isDark = useDark()
  // 默认主题
  const defaultThemeConfig: Theme = {
    colors: {
      primary: '#409EFF',
      info: '#eeeeee',
      warning: '#fbbd23',
      danger: '#f87272',
      success: '#36d399'
    }
  }

  const getTheme = (): Theme => {
    const theme = localStorage.getItem(SYSTEMTHEMECOLORKEY)
    return theme ? JSON.parse(theme) : defaultThemeConfig
  }

  const themeConfig = reactive<Theme>(
    Object.assign({}, getTheme())
  )

  const themeDialogVisible = ref(false)

  function updateBrandExtendColorsVar(
    color: string,
    name: string
  ) {
    const { DEFAULT, dark, light } = genMixColor(
      color,
      isDark.value
    )

    // 每种主题色由浅到深分为五个阶梯以供开发者使用。
    setStyleProperty(`--${name}-lighter-color`, light[5])
    setStyleProperty(`--${name}-light-color`, light[3])
    setStyleProperty(`--${name}-color`, DEFAULT)
    setStyleProperty(`--${name}-deep-color`, dark[2])
    setStyleProperty(`--${name}-deeper-color`, dark[4])

    // elementPlus主题色更新
    setStyleProperty(`--el-color-${name}`, DEFAULT)
    setStyleProperty(`--el-color-${name}-dark-2`, dark[2])
    setStyleProperty(`--el-color-${name}-light-3`, light[3])
    setStyleProperty(`--el-color-${name}-light-5`, light[5])
    setStyleProperty(`--el-color-${name}-light-7`, light[7])
    setStyleProperty(`--el-color-${name}-light-8`, light[8])
    setStyleProperty(`--el-color-${name}-light-9`, light[9])
  }

  /**
   * 更新主题色变量
   * @param param0 {Theme}
   */
  function updateThemeColorVar({ colors }: Theme) {
    // 遍历当前主题色，生成混合色，并更新到css变量（tailwind + elementPlus）
    for (const brand in colors) {
      updateBrandExtendColorsVar(
        colors[brand as keyof Theme['colors']] as string,
        brand
      )
    }
  }

  /**
   * 设置主题
   * @param data {Theme}
   */
  const setTheme = (data: Theme = defaultThemeConfig) => {
    const oldTheme = getTheme()

    // 将传入配置与旧的主题合并，以填补缺省的值
    data = merge(oldTheme, data || {})

    // 将缓存到浏览器
    localStorage.setItem(
      SYSTEMTHEMECOLORKEY,
      JSON.stringify(data)
    )

    // 将主题更新到css变量中，使之生效
    updateThemeColorVar(data)
  }

  /**
   * 初始化主题
   */
  const initTheme = () => {
    const theme = getTheme()
    setTheme(theme)
  }
  /**
   * 切换主题
   */
  const handleConfirmTheme = () => {
    setTheme(themeConfig)
    // 本地保存
    localStorage.setItem(
      SYSTEMTHEMECOLORKEY,
      JSON.stringify(themeConfig)
    )
    themeDialogVisible.value = false
  }

  const themeFormRef = ref<FormInstance>()
  /**
   * 切换主题色
   */
  const handleClickChangeThemeColor = () => {
    themeDialogVisible.value = true
    nextTick(() => {
      themeFormRef.value?.resetFields()
    })
  }

  const handleClickChangeTheme = () => {
    isDark.value = !isDark.value
  }

  /**
   * 重置主题
   */
  const resetTheme = () => {
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
    resetTheme
  }
}

/**
 * 修改浏览器tab的title
 * @param title {sting}
 */
export const changeTabTile = (title: string) => {
  document.title = title
}

/**
 * 修改浏览器tab的icon
 * @param iconPath {string}
 */
export const setTabIco = (iconPath: string) => {
  const linkElement =
    document.querySelector<HTMLLinkElement>(
      "link[rel*='icon']"
    ) || document.createElement('link')
  linkElement.type = 'image/x-icon'
  linkElement.rel = 'shortcut icon'
  linkElement.href = iconPath
  document.head.appendChild(linkElement)
}

const icos = import.meta.glob<{ default: string }>(
  '../assets/svg-icons/*.svg',
  { eager: true }
)

/**
 * 修改页面tab的ico
 * @param to {RouteLocationNormalizedGeneric}
 */
export const changeTabIco = (
  to: RouteLocationNormalizedGeneric
) => {
  const [parentModule] = to.matched
  const parentModuleName = parentModule.name as string
  const processedIcos = Object.fromEntries(
    Object.entries(icos).map(([key, value]) => {
      // 去掉前缀和后缀
      const newKey = key
        .replace('../assets/svg-icons/', '')
        .replace('.svg', '')
      return [newKey, value]
    })
  )
  const targetIco = processedIcos[parentModuleName]

  if (targetIco) {
    setTabIco(targetIco.default)
  } else
    setTabIco(
      '/study-java-web/src/assets/svg-icons/other.svg'
    )
}
