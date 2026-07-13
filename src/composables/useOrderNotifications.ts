import { onBeforeUnmount, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useUserInfoStore } from '@store'
import { eventEmitter } from '@/utils/event-emits'
import { getSharedWebSocketClient } from '@/utils/websocket'

export const useOrderNotifications = () => {
  const userInfoStore = useUserInfoStore()
  let unsubscribe: (() => void) | null = null
  let lastErrorNoticeAt = 0

  const stopWatch = watch(
    () => userInfoStore.getId,
    (userId) => {
      unsubscribe?.()
      unsubscribe = null
      if (!userId) return

      unsubscribe = getSharedWebSocketClient().subscribe<OrderPaidEvent>(
        `/topic/orders/${userId}`,
        (event) => {
          ElNotification.success({
            title: '订单支付成功',
            message: `订单 ${event.orderNo}，交易号 ${event.transactionNo}`,
          })
          eventEmitter.emit('order-paid', event)
        },
        (error) => {
          console.error('订单 WebSocket 连接失败:', error)
          const now = Date.now()
          if (now - lastErrorNoticeAt > 10000) {
            ElMessage.error('订单实时通知连接失败，系统将自动重连')
            lastErrorNoticeAt = now
          }
        }
      )
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    stopWatch()
    unsubscribe?.()
  })
}
