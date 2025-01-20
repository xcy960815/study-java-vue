import color from 'css-color-function'
import { ref } from 'vue'

export const formula = {
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

const useFetch = async <T extends string>(
  url: string,
  isBlob = false
) => {
  const data = ref<T | null>(null)
  const address = ref('')
  await new Promise<void>((resolve, reject) => {
    const client = new XMLHttpRequest()
    client.responseType = isBlob ? 'blob' : ''
    client.onreadystatechange = () => {
      if (client.readyState !== 4) return
      if (client.status === 200) {
        const urlArr = client.responseURL.split('/')
        data.value = client.response
        address.value = urlArr[urlArr.length - 1]
        resolve()
      } else {
        reject(new Error(client.statusText))
      }
    }
    client.open('GET', url)
    client.send()
  })
  return {
    data: data.value,
    url: address.value
  }
}

export const getFontFiles = async (fontFiles: string[]) => {
  const fonts = await Promise.all(
    fontFiles.map((font: string) =>
      useFetch<string>(
        `//unpkg.com/element-plus/dist/fonts/${font}`,
        true
      )
    )
  )
  return fonts
}

export const getIndexStyle = async () => {
  const { data } = await useFetch<string>(
    '//unpkg.com/element-plus/dist/index.css'
  )
  return data
}

export const getStyleTemplate = (data: string) => {
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

export const getSeparatedStyles = async () => {
  const { data } = await useFetch(
    '//unpkg.com/element-plus/theme-chalk/'
  )
  const styles = data
    .match(/href="[\w-]+\.css"/g)
    .map((str: string) => str.split('"')[1])
  const files = await Promise.all(
    styles.map((file: File) => {
      return useFetch(
        `//unpkg.com/element-plus/theme-chalk/${file}`
      )
    })
  )
  return files
}

export const generateColors = (primary: string) => {
  const colors: { [key: string]: string } = {}
  Object.entries(formula).forEach(([key, value]) => {
    const replacedValue = value.replace(/primary/g, primary)
    colors[key] = color.convert(replacedValue)
  })
  return colors
}

// 写入新的css样式
export const writeNewStyle = (
  stylesheetCount: number,
  originalStyle: string,
  colors: {
    primary: string
  }
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
