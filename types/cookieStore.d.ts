interface GetCookieOption {
  name?: string
  url?: string
}

interface GetAllCookieOption extends GetCookieOption {}
interface SetCookieOption {
  /**
   * 记录 cookie 名称的字符串。
   */
  name: string
  /**
   * 表示 cookie 的值的字符串。
   */
  value: string
  /**
   * Unix 时间戳（以毫秒为单位表示），记录 cookie 的到期日期。默认为 null。
   */
  expires?: number | null
  /**
   * 记录 cookie 域名的字符串。默认为 null。
   */
  domain?: string | null

  /**
   * 一个布尔值，表示 cookie 是否是分区 cookie（true）或（false）。更多信息请参阅 具有独立分区状态的 Cookie（CHIPS）。
   */
  partitioned?: boolean

  /**
   * 记录 cookie 路径的字符串。默认为 /。
   */
  path?: string
  /**
   * "strict" Cookie 只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。
   * "lax" Cookie 不会在正常的跨站点子请求（例如将图像或框架加载到第三方站点）中发送，而是在用户在原始站点内导航时（即点击链接时）发送。
   * "none" Cookie 将被发送至所有上下文。
   */
  sameSite?: 'strict' | 'lax' | 'none'
}

interface DeleteCookieOption {
  name: string
  domain?: string
  path?: string
  partitioned?: boolean
}

interface CookieResult {
  name: string
  value: string
  domain: string
  expires: number
  partitioned: boolean
  path: string
  sameSite: 'strict' | 'lax' | 'none'
  secure: boolean
}

interface CookieStore extends Event {
  get(key: string): Promise<CookieResult | undefined>
  get(
    option: GetCookieOption
  ): Promise<CookieResult | undefined>
  getAll(key: string): Promise<CookieResult[]>
  getAll(
    option: GetAllCookieOption
  ): Promise<CookieResult[]>
  set(option: SetCookieOption): Promise<void>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  delete(option: DeleteCookieOption): Promise<void>
  onchange(event: Event): void
}

declare const cookieStore: CookieStore
