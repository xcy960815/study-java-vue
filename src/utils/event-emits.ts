type EventsList = {
  'token-invalid': () => void
  login: () => void
  logout: () => void
  'get-routes': () => Promise<void>
}

type Listener<T extends (...args: any[]) => any> = {
  fn: T
  once?: boolean
}

class TypedEventEmitter<Events extends Record<string, (...args: any[]) => any>> {
  private events: { [K in keyof Events]?: Listener<Events[K]>[] } = {}
  private errorHandler?: (err: unknown, eventName: keyof Events) => void

  /**
   * 注册监听
   * @param eventName 事件名
   * @param listener 监听器
   */
  on<K extends keyof Events>(eventName: K, listener: Events[K]): void {
    this.addListener(eventName, listener)
  }

  /**
   * 一次性监听器
   * @param eventName 事件名
   * @param listener 监听器
   */
  once<K extends keyof Events>(eventName: K, listener: Events[K]): void {
    this.addListener(eventName, listener, true)
  }

  /**
   * 添加到队列头部
   * @param eventName 事件名
   * @param listener 监听器
   */
  prependListener<K extends keyof Events>(eventName: K, listener: Events[K]): void {
    this.addListener(eventName, listener, false, true)
  }

  /**
   * 通用添加监听器方法
   * @param eventName 事件名
   * @param fn 监听器
   * @param once 是否一次性
   * @param prepend 是否添加到队列头部
   */
  private addListener<K extends keyof Events>(
    eventName: K,
    fn: Events[K],
    once = false,
    prepend = false
  ): void {
    const wrapper: Listener<Events[K]> = { fn, once }
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    if (prepend) {
      this.events[eventName]!.unshift(wrapper)
    } else {
      this.events[eventName]!.push(wrapper)
    }
  }

  /**
   * 注销监听器
   * @param eventName 事件名
   * @param listener 监听器
   */
  off<K extends keyof Events>(eventName: K, listener: Events[K]): void {
    const list = this.events[eventName]
    if (list) {
      this.events[eventName] = list.filter((l) => l.fn !== listener)
    }
  }

  /**
   * 设置错误处理函数
   * @param handler 错误处理函数
   */
  onError(handler: (err: unknown, eventName: keyof Events) => void): void {
    this.errorHandler = handler
  }

  /**
   * emit 同步事件，返回所有 listener 的返回值
   * @param eventName 事件名
   * @param args 参数
   * @returns 所有 listener 的返回值
   */
  emit<K extends keyof Events>(
    eventName: K,
    ...args: Parameters<Events[K]>
  ): ReturnType<Events[K]>[] {
    const results: ReturnType<Events[K]>[] = []
    const listeners = this.events[eventName]?.slice() ?? []

    for (const { fn, once } of listeners) {
      try {
        const result = fn(...args)
        results.push(result)
      } catch (err) {
        this.errorHandler?.(err, eventName)
      }
      if (once) {
        this.off(eventName, fn)
      }
    }

    return results
  }

  /**
   * emit 异步事件，返回所有 Promise<返回值>
   * @param eventName 事件名
   * @param args 参数
   * @returns 所有 Promise<返回值>
   */
  async emitAsync<K extends keyof Events>(
    eventName: K,
    ...args: Parameters<Events[K]>
  ): Promise<Awaited<ReturnType<Events[K]>>[]> {
    const results: Awaited<ReturnType<Events[K]>>[] = []
    const listeners = this.events[eventName]?.slice() ?? []

    for (const { fn, once } of listeners) {
      try {
        const result = await fn(...args)
        results.push(result)
      } catch (err) {
        this.errorHandler?.(err, eventName)
      }
      if (once) {
        this.off(eventName, fn)
      }
    }

    return results
  }
}

export const BASE_REDIRECT_PATH = '/system/user'
export const LOGIN_PATH = '/login'
export const WHITELIST_PATHS = [LOGIN_PATH]
const eventEmitter = new TypedEventEmitter<EventsList>()

export { eventEmitter }
