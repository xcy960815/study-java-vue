/**
 * 该文件作用是修改系统主题颜色
 */
import { render, createVNode, computed, reactive, ref, watchEffect, type Component } from 'vue'
import { svg2bese64 } from '@utils/svg2base64'
import { type RouteLocationNormalizedGeneric } from 'vue-router'
import { genMixColor } from './generate-color'
import { usePreferredDark } from '@vueuse/core'
import { svgIconContents } from '@assets/svg-icons'
import { getIconParkIcon } from './icon-park'

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
 * 旧版（vueuse useDark）亮暗偏好键：迁移到新键后清理
 */
const LEGACY_SCHEME_KEY = 'vueuse-color-scheme'

/**
 * 外观模式：亮色 / 暗色 / 跟随系统
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * 主色亮暗值对：亮色模式用 light，暗色模式用 dark（暗色值更浅，暗底下更醒目）
 */
export interface PrimaryColors {
  light: string
  dark: string
}

/**
 * 预设主题色项：分组展示文案与亮暗两档色值（迁移自 guibiao）
 */
export interface PresetThemeColor {
  /** 展示文案 */
  label: string
  /** 亮色模式的主色 */
  light: string
  /** 暗色模式的主色 */
  dark: string
}

/**
 * 预设主题色板：第一项保持 Element Plus 品牌蓝（与既有默认一致，方便旧配置迁移），
 * 其余整组迁自 guibiao——暗色档比亮色档更浅，切换模式自动换色
 */
export const PRESET_THEME_COLORS: readonly PresetThemeColor[] = [
  { label: '天青蓝', light: '#409EFF', dark: '#66B1FF' },
  { label: '知更蓝', light: '#1677ff', dark: '#4096ff' },
  { label: '克莱因蓝', light: '#002fa7', dark: '#5e93ff' },
  { label: '焦糖', light: '#9a6438', dark: '#c2895d' },
  { label: '藤紫', light: '#5e3f8c', dark: '#a587da' },
  { label: '石青', light: '#1e6a72', dark: '#5aa1a9' },
  { label: '勃艮第', light: '#7a2840', dark: '#d67a8f' },
  { label: '橄榄', light: '#6a6a32', dark: '#989960' },
  { label: '墨绿', light: '#143c34', dark: '#759e93' },
  { label: '梅紫', light: '#8a3a68', dark: '#d07aa9' },
  { label: '黛蓝', light: '#3a5278', dark: '#7d97c1' },
] as const

/** 校验 Hex 颜色值（3 位或 6 位） */
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR_PATTERN.test(value)

/** 合法的旧 brand 组（info/warning/success/danger 之外的键忽略） */
const BRAND_KEYS = ['info', 'warning', 'success', 'danger'] as const

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

/** 默认外观：跟随系统 + 天青蓝（沿用 useDark 历史行为） */
const DEFAULT_MODE: ThemeMode = 'system'
const DEFAULT_PRIMARY_COLORS: PrimaryColors = {
  light: PRESET_THEME_COLORS[0].light,
  dark: PRESET_THEME_COLORS[0].dark,
}

/**
 * 持久化的外观偏好：亮暗模式 + 亮暗双值主色 + 其它合成品牌色
 */
interface AppearancePreferences {
  mode: ThemeMode
  primaryColors: PrimaryColors
  colors: Theme['colors']
}

/**
 * 设置 CSS 变量
 */
export function setStyleProperty(propName: string, value: string): void {
  document.documentElement.style.setProperty(propName, value)
}

/**
 * 读取并收敛外观偏好：
 * - 新键结构为 { mode, primaryColors, colors }，非法值回退默认
 * - 只存旧结构 colors 的浏览器：primary 迁移为亮暗同值
 * - 旧的 vueuse-color-scheme 键映射为初始 mode 后清理
 */
function safeReadPreferences(): AppearancePreferences {
  let stored: Partial<AppearancePreferences> = {}
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYSTEM_THEME_COLOR)
    if (raw) {
      stored = JSON.parse(raw) as Partial<AppearancePreferences>
    }
  } catch {
    stored = {}
  }

  const storedColors = (stored.colors ?? DEFAULT_THEME.colors) as Theme['colors']
  const legacyPrimary = isHexColor(storedColors.primary)
    ? storedColors.primary
    : DEFAULT_PRIMARY_COLORS.light

  let mode: ThemeMode = DEFAULT_MODE
  if (stored.mode === 'light' || stored.mode === 'dark' || stored.mode === 'system') {
    mode = stored.mode
  } else {
    // 旧版未存 mode：沿用 useDark 的亮暗记忆，auto 视作跟随系统
    try {
      const legacyScheme = localStorage.getItem(LEGACY_SCHEME_KEY)
      if (legacyScheme === 'light' || legacyScheme === 'dark') {
        mode = legacyScheme
      }
    } catch {
      // 忽略读取失败
    }
  }

  const colors: Theme['colors'] = {}
  BRAND_KEYS.forEach((brand) => {
    const value = storedColors[brand]
    if (isHexColor(value)) {
      colors[brand] = value
    }
  })

  const storedLight = stored.primaryColors?.light
  const storedDark = stored.primaryColors?.dark

  return {
    mode,
    primaryColors: {
      light: isHexColor(storedLight) ? storedLight : legacyPrimary,
      dark: isHexColor(storedDark) ? storedDark : legacyPrimary,
    },
    colors,
  }
}

/**
 * 写回外观偏好（localStorage 异常时静默降级，仅内存态生效）
 */
function safePersistPreferences(preferences: AppearancePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_THEME_COLOR, JSON.stringify(preferences))
  } catch {
    // 忽略写入失败
  }
}

/**
 * 外观偏好共享单例：头部主题按钮、用户菜单入口与个性化设置抽屉共用同一状态
 */
const systemPrefersDark = usePreferredDark()
const initialPreferences = safeReadPreferences()

const mode = ref<ThemeMode>(initialPreferences.mode)
const primaryColors = reactive<PrimaryColors>({ ...initialPreferences.primaryColors })
const otherBrandColors = reactive<Theme['colors']>({ ...initialPreferences.colors })

/** 跟随系统模式下由系统深色偏好驱动 */
const isDark = computed(
  () => mode.value === 'dark' || (mode.value === 'system' && systemPrefersDark.value)
)

/** 解析后的当前主色：按亮暗模式取双值主色的对应档 */
const resolvedPrimaryColor = computed(() => (isDark.value ? primaryColors.dark : primaryColors.light))

/** 个性化设置抽屉可见性（主题按钮与用户菜单入口共用） */
const drawerVisible = ref(false)

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

// 首次执行即完成一次完整生效，此后任意依赖变化自动联动
watchEffect(() => {
  // 1) 同步 html 根元素暗色类（Element Plus dark css-vars 按该类生效），混色基准随模式读取
  document.documentElement.classList.toggle('dark', isDark.value)
  // 2) 双值主色取当前模式侧写入 Element Plus 主色变量族
  updateBrandExtendColorsVar(resolvedPrimaryColor.value, 'primary')
  // 3) 其它合成品牌色（info/warning/success/danger）
  Object.entries(otherBrandColors).forEach(([brand, color]) => {
    if (color) {
      updateBrandExtendColorsVar(color, brand)
    }
  })
  // 4) 供原生样式（色卡选中环、hover 反馈等）引用的当前主色
  setStyleProperty('--sj-primary', resolvedPrimaryColor.value)
})

function persistCurrent(): void {
  safePersistPreferences({
    mode: mode.value,
    primaryColors: { light: primaryColors.light, dark: primaryColors.dark },
    colors: { ...otherBrandColors },
  })
}

/** 设置外观模式（亮色/暗色/跟随系统） */
function setMode(next: ThemeMode): void {
  mode.value = next
  persistCurrent()
}

/** 写入亮暗双值主色（预设色板点击） */
function setPrimaryColors(colors: PrimaryColors): void {
  primaryColors.light = colors.light
  primaryColors.dark = colors.dark
  persistCurrent()
}

/** 自定义主色：以一个色值同时应用到亮暗两档 */
function setSinglePrimaryColor(color: string): void {
  if (!isHexColor(color)) {
    return
  }
  setPrimaryColors({ light: color, dark: color })
}

/**
 * 系统主题管理（共享单例版本，原为每次调用新建状态的 composable）
 */
export const useSystemTheme = () => {
  return {
    mode,
    isDark,
    systemPrefersDark,
    drawerVisible,
    primaryColors,
    otherBrandColors,
    resolvedPrimaryColor,
    setMode,
    setPrimaryColors,
    setSinglePrimaryColor,
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
  const iconName = String(to.meta.icon || '')
  const localSvgIcon = svgIconContents[iconName as keyof typeof svgIconContents]

  if (localSvgIcon) {
    setTabIcon(svg2bese64(localSvgIcon))
    return
  }

  if (!iconName) {
    return
  }

  const icon = getIconParkIcon(iconName)
  if (!icon) {
    return
  }

  const size = 16
  const vnode = createVNode(icon as Component, { theme: 'outline', size, fill: '#333' })
  const container = document.createElement('div')

  render(vnode, container)

  const svg = container.querySelector<SVGElement>('svg')
  if (svg) {
    setTabIcon(svg2bese64(svg))
  }
}
