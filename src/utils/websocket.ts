import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

type MessageHandler<T = unknown> = (message: T) => void
type ErrorHandler = (error: unknown) => void

export class WebSocketClient {
  private client: Client
  private subscriptions = new Map<string, Map<MessageHandler, StompSubscription | null>>()
  private errorHandlers = new Set<ErrorHandler>()

  constructor(private readonly url: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.url),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => this.restoreSubscriptions(),
      onStompError: (frame) => this.notifyError(frame),
      onWebSocketError: (event) => this.notifyError(event),
    })
  }

  subscribe<T>(destination: string, handler: MessageHandler<T>, onError?: ErrorHandler) {
    const typedHandler = handler as MessageHandler
    const destinationHandlers = this.subscriptions.get(destination) ?? new Map()
    destinationHandlers.set(typedHandler, null)
    this.subscriptions.set(destination, destinationHandlers)
    if (onError) this.errorHandlers.add(onError)

    if (!this.client.active) this.client.activate()
    if (this.client.connected) this.activateSubscription(destination, typedHandler)

    return () => {
      destinationHandlers.get(typedHandler)?.unsubscribe()
      destinationHandlers.delete(typedHandler)
      if (destinationHandlers.size === 0) this.subscriptions.delete(destination)
      if (onError) this.errorHandlers.delete(onError)
      if (this.subscriptions.size === 0) {
        void this.client.deactivate().then(() => {
          if (this.subscriptions.size > 0 && !this.client.active) this.client.activate()
        })
      }
    }
  }

  getIsConnected() {
    return this.client.connected
  }

  private restoreSubscriptions() {
    this.subscriptions.forEach((handlers, destination) => {
      handlers.forEach((_subscription, handler) => {
        handlers.set(handler, null)
        this.activateSubscription(destination, handler)
      })
    })
  }

  private activateSubscription(destination: string, handler: MessageHandler) {
    const handlers = this.subscriptions.get(destination)
    if (!handlers || handlers.get(handler)) return
    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        handler(JSON.parse(message.body))
      } catch (error) {
        this.notifyError(error)
      }
    })
    handlers.set(handler, subscription)
  }

  private notifyError(error: unknown) {
    this.errorHandlers.forEach((handler) => handler(error))
  }
}

let sharedClient: WebSocketClient | null = null

export const getWebSocketUrl = () => {
  const apiPrefix = import.meta.env.VITE_API_DOMAIN_PREFIX || '/dev-api'
  const normalizedPrefix = `/${apiPrefix}`.replace(/\/+/g, '/').replace(/\/$/, '')
  return `${window.location.protocol}//${window.location.host}${normalizedPrefix}/ws/server-monitor`
}

export const getSharedWebSocketClient = () => {
  if (!sharedClient) sharedClient = new WebSocketClient(getWebSocketUrl())
  return sharedClient
}
