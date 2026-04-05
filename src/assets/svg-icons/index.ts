/**
 * @link https://www.iconfinder.com/search?q=user&price=free&style=solid
 */

/**
 * 当前文件下的svg文件已经在vite-config中注册了 现在做的是 让路由的meta下面的icon 支持提示
 */
const svgIcons = {
  user: 'user',
  lock: 'lock',
  'goods-category': 'goods-category',
  'goods-category-list': 'goods-category-list',
  system: 'system',
  'admin-user': 'admin-user',
  'admin-user-list': 'admin-user-list',
  other: 'other',
  password: 'password',
  'user-list': 'user-list',
  'server-send-event': 'server-send-event',
  deepseek: 'deepseek',
  ollama: 'ollama',
  chat: 'chat',
}

type SvgIconName = keyof typeof svgIcons

const svgIconModules = import.meta.glob('./*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const svgIconContents = Object.keys(svgIcons).reduce(
  (result, name) => {
    const modulePath = `./${name}.svg`
    const content = svgIconModules[modulePath]

    if (content) {
      result[name as SvgIconName] = content
    }

    return result
  },
  {} as Partial<Record<SvgIconName, string>>
) as Record<SvgIconName, string>

const svgIconNames = Object.keys(svgIcons) as SvgIconName[]

export type { SvgIconName }
export { svgIcons, svgIconContents, svgIconNames }
