declare namespace NotificationStore {
  /**
   * 应用内通知（本地生成，不来自后端接口）
   */
  type AppNotification = {
    id: string
    type: 'order'
    title: string
    content: string
    orderId?: number
    orderNo?: string
    createdAt: number
    read: boolean
  }

  type State = {
    notifications: Array<AppNotification>
  }

  type Getters = {
    getUnreadCount: (state: State) => number
  }

  type Actions = {
    setNotifications: (value: Array<AppNotification>) => void
    addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    clearNotifications: () => void
    resetState: () => void
  }
}
