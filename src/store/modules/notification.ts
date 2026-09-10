import { defineStore } from 'pinia'
import { StoreNames } from '@enums'

const NOTIFICATION_LIMIT = 50

const createDefaultState = (): NotificationStore.State => ({
  notifications: [],
})

export const notificationStore = defineStore<
  StoreNames.NOTIFICATION,
  BaseStore.State<NotificationStore.State>,
  BaseStore.Getters<NotificationStore.State, NotificationStore.Getters>,
  BaseStore.Actions<NotificationStore.State, NotificationStore.Actions>
>(StoreNames.NOTIFICATION, {
  state: () => createDefaultState(),
  getters: {
    getNotifications: (state) => state.notifications,
    getUnreadCount: (state) => state.notifications.filter((item) => !item.read).length,
  },
  actions: {
    setNotifications(value: Array<NotificationStore.AppNotification>) {
      this.notifications = value
    },
    /**
     * 新增一条通知，超出上限时裁掉最旧的
     */
    addNotification(notification) {
      this.notifications.unshift({
        ...notification,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        read: false,
      })
      if (this.notifications.length > NOTIFICATION_LIMIT) {
        this.notifications = this.notifications.slice(0, NOTIFICATION_LIMIT)
      }
    },
    markAsRead(id: string) {
      const target = this.notifications.find((item) => item.id === id)
      if (target) target.read = true
    },
    markAllAsRead() {
      this.notifications.forEach((item) => {
        item.read = true
      })
    },
    clearNotifications() {
      this.notifications = []
    },
    resetState() {
      Object.assign(this, createDefaultState())
    },
  },
  persist: {
    key: 'notification-store',
  },
})
