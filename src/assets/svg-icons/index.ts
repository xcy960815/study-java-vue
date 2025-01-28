/**
 * @link https://www.iconfinder.com/search?q=user&price=free&style=solid
 */

/**
 * 当前文件下的svg文件已经在vite-config中注册了 现在做的是 让路由的meta下面的icon 支持提示
 */
const svgIcons = [
  'user',
  'lock',
  'goods-category',
  'goods-category-list',
  'system',
  'admin-user',
  'admin-user-list',
  'other',
  'password',
  'user-list',
  'server-send-event'
] as const

export { svgIcons }
