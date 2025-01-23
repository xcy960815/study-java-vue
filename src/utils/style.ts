/** 该文件作用是修改系统主题颜色 */
import color from 'css-color-function'
import { type FormInstance } from 'element-plus'
import {
  computed,
  reactive,
  ref,
  nextTick,
  onMounted
} from 'vue'
import { type RouteLocationNormalizedGeneric } from 'vue-router'

/**
 * 侧边栏宽度key
 */
export const LAYOUTSIDECONTAINERWIDTHKEY =
  '--layout-side-container-width'

/**
 * 系统主题key
 */
const SYSTEMTHEME = 'system-theme'

interface Result {
  data: string
  url: string
}

interface Colors {
  primary: string
}

/**
 * 设置系统主题
 * @returns
 */
export const setSystemTheme = () => {
  /**
   *
   * @param url {string}
   * @param isBlob {boolean}
   * @returns
   */
  const useFetch = async (
    url: string,
    isBlob: boolean = false
  ): Promise<Result> => {
    const result = reactive<Result>({
      // data: isBlob ? new Blob() : "",
      data: '',
      url: ''
    })

    return new Promise<Result>((resolve, reject) => {
      const client = new XMLHttpRequest()
      client.responseType = isBlob ? 'blob' : 'text'
      client.onreadystatechange = () => {
        if (client.readyState !== 4) return
        if (client.status === 200) {
          const urlArr = client.responseURL.split('/')
          result.data = client.response
          result.url = urlArr[urlArr.length - 1]
          resolve(result)
        } else {
          reject(new Error(client.statusText))
        }
      }
      client.open('GET', url)
      client.send()
    })
  }

  const formula = {
    'darken-1': 'color(primary lightness(-10%))',
    'shade-1': 'color(primary shade(10%))',
    'light-1': 'color(primary tint(10%))',
    'light-2': 'color(primary tint(20%))',
    'light-3': 'color(primary tint(30%))',
    'light-4': 'color(primary tint(40%))',
    'light-5': 'color(primary tint(50%))',
    'light-6': 'color(primary tint(60%))',
    'light-7': 'color(primary tint(70%))',
    'light-8': 'color(primary tint(80%))',
    'light-9': 'color(primary tint(90%))'
  }

  /**
   * 获取element-plus 原始样式
   * @returns {string}
   */
  const getElementOrignalStyle = async () => {
    const { data } = await useFetch(
      '//unpkg.com/element-plus/dist/index.css'
    )
    return data
  }

  /**
   * 获取样式模板
   * @param data {string}
   * @returns {string}
   */
  const getStyleTemplate = (data: string) => {
    const colorMap = {
      '#3a8ee6': 'shade-1',
      '#409eff': 'primary',
      '#0d84ff': 'darken-1',
      '#53a8ff': 'light-1',
      '#66b1ff': 'light-2',
      '#79bbff': 'light-3',
      '#8cc5ff': 'light-4',
      '#a0cfff': 'light-5',
      '#b3d8ff': 'light-6',
      '#c6e2ff': 'light-7',
      '#d9ecff': 'light-8',
      '#ecf5ff': 'light-9'
    }
    Object.entries(colorMap).forEach(([key, value]) => {
      data = data.replace(new RegExp(key, 'ig'), value)
    })
    return data
  }

  /**
   * 生成颜色
   * @param primary {string}
   * @returns {Record<string,string>}
   */
  const generateColors = (primary: string) => {
    const colors: { [key: string]: string } = {}
    Object.entries(formula).forEach(([key, value]) => {
      const replacedValue = value.replace(
        /primary/g,
        primary
      )
      colors[key] = color.convert(replacedValue)
    })
    return colors
  }

  /**
   * 写入新的css样式
   * @param stylesheetCount {number}
   * @param originalStyle {string}
   * @param colors {Record<string,string>}
   */
  const writeNewStyle = (
    stylesheetCount: number,
    originalStyle: string,
    colors: Record<string, string>
  ) => {
    Object.entries(colors).forEach(([key, value]) => {
      originalStyle = originalStyle.replace(
        new RegExp('(:|\\s+)' + key, 'g'),
        '$1' + value
      )
    })
    if (stylesheetCount === document.styleSheets.length) {
      const style = document.createElement('style')
      style.innerText = originalStyle
      document.head.appendChild(style)
    } else {
      const headLastChild = document.head
        .lastChild as HTMLElement
      headLastChild.innerText = originalStyle
    }
  }

  const themeDialogVisible = ref(false)

  const colors = reactive<Colors>({
    primary: '#409eff'
  })
  /**
   * 原本的样式
   */
  const originalStyle = ref('')

  /**
   * header 标签中 style标签的数量
   */
  const originalStylesheetCount = computed(() => {
    const styleSheetsCount =
      document.styleSheets.length || -1
    return styleSheetsCount
  })

  /**
   * 初始化主题
   */
  const initTheme = async () => {
    const data = await getElementOrignalStyle()
    originalStyle.value = getStyleTemplate(data)
    const theme: Colors = JSON.parse(
      localStorage.getItem(SYSTEMTHEME) || '{}'
    )
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        colors[key as keyof Colors] = value
      })
    }
    generateColors(colors.primary)
    writeNewStyle(
      originalStylesheetCount.value,
      originalStyle.value,
      colors
    )
  }
  /**
   * 切换主题
   */
  const handleConfirmTheme = () => {
    generateColors(colors.primary)
    writeNewStyle(
      originalStylesheetCount.value,
      originalStyle.value,
      colors
    )
    // 本地保存
    localStorage.setItem(
      SYSTEMTHEME,
      JSON.stringify(colors)
    )
    themeDialogVisible.value = false
  }

  const themeFormRef = ref<FormInstance>()
  /**
   * 切换主题
   */
  const handleClickChangeTheme = () => {
    themeDialogVisible.value = true
    nextTick(() => {
      themeFormRef.value?.resetFields()
    })
  }

  /**
   * 重置主题
   */
  const resetTheme = () => {
    themeFormRef.value?.resetFields()
  }

  return {
    initTheme,
    handleConfirmTheme,
    handleClickChangeTheme,
    themeDialogVisible,
    themeFormRef,
    resetTheme,
    colors
  }
}

/**
 * 修改style变量
 * @param key {String} 变量名称
 * @param value {Srring} 变量值
 * @param dom {HTMLElement} 变量所在的dom
 */
export const setVarStyle = (
  key: string,
  value: string,
  dom: HTMLElement = document.documentElement
) => {
  dom.style.setProperty(key, value)
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
  console.log('parentModuleName', parentModuleName)

  const processedIcos = Object.fromEntries(
    Object.entries(icos).map(([key, value]) => {
      // 去掉前缀和后缀
      const newKey = key
        .replace('../assets/svg-icons/', '')
        .replace('.svg', '')
      return [newKey, value]
    })
  )
  console.log('processedIcos-processedIcos', processedIcos)

  const targetIco = processedIcos[parentModuleName]

  if (targetIco) {
    setTabIco(targetIco.default)
  } else
    setTabIco(
      '/study-java-web/src/assets/svg-icons/other.svg'
    )
}
