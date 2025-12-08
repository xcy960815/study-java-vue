import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export class WebSocketClient {
  private client: Client | null = null
  private url: string
  private reconnectDelay: number = 5000
  private isConnected: boolean = false

  constructor(url: string) {
    this.url = url
  }

  /**
   * 连接 WebSocket
   */
  connect(
    onMessage: (message: any) => void,
    onConnect?: () => void,
    onError?: (error: any) => void
  ) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.url) as any,
      debug: (str) => {
        console.log('[WebSocket Debug]:', str)
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WebSocket] 连接成功')
        this.isConnected = true
        if (onConnect) {
          onConnect()
        }

        // 订阅服务器监控主题
        this.client?.subscribe('/topic/server-monitor', (message) => {
          const data = JSON.parse(message.body)
          onMessage(data)
        })
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP 错误:', frame.headers['message'])
        console.error('[WebSocket] 详细:', frame.body)
        this.isConnected = false
        if (onError) {
          onError(frame)
        }
      },
      onWebSocketError: (event) => {
        console.error('[WebSocket] WebSocket 错误:', event)
        this.isConnected = false
        if (onError) {
          onError(event)
        }
      },
      onDisconnect: () => {
        console.log('[WebSocket] 连接断开')
        this.isConnected = false
      },
    })

    this.client.activate()
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.isConnected = false
      console.log('[WebSocket] 主动断开连接')
    }
  }

  /**
   * 是否已连接
   */
  getIsConnected(): boolean {
    return this.isConnected
  }
}
