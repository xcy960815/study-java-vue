const eventNames = [
  'token-invalid',
  'login',
  'logout'
] as const

// 定义事件名称
type EventNames = (typeof eventNames)[number]

// 定义事件与回调参数的映射
interface EventMap {
  'token-invalid': [] // 无参数
  login: [] // 示例参数为数字
  logout: []
}

// 自定义事件发射器类
class CustomEventEmitter {
  private listeners: Map<
    EventNames,
    Set<(...args: any[]) => void>
  > = new Map()

  /**
   * 监听事件
   * @param eventName
   * @param listener
   * @returns
   */
  public on<T extends EventNames>(
    eventName: T,
    listener: (...args: EventMap[T]) => void
  ): this {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set())
    }
    this.listeners
      .get(eventName)!
      .add(listener as (...args: any[]) => void)
    return this
  }

  /**
   * 触发事件
   * @param eventName {T extends EventNames}
   * @param args
   * @returns
   */
  public emit<T extends EventNames>(
    eventName: T,
    ...args: EventMap[T]
  ): boolean {
    const listeners = this.listeners.get(eventName)
    if (!listeners || listeners.size === 0) return false
    listeners.forEach((listener) => listener(...args))
    return true
  }

  /**
   * 移除监听
   * @param eventName
   * @param listener
   * @returns
   */
  public off<T extends EventNames>(
    eventName: T,
    listener: (...args: EventMap[T]) => void
  ): this {
    this.listeners
      .get(eventName)
      ?.delete(listener as (...args: any[]) => void)
    return this
  }
}

// 使用示例
const eventEmitter = new CustomEventEmitter()

export { eventEmitter }
