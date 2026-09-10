const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * 把时间戳格式化为相对时间文案（刚刚 / N 分钟前 / N 小时前 / N 天前）
 * @param timestamp 毫秒时间戳
 * @param now 当前时间（可注入，便于测试）
 */
export const formatRelativeTime = (timestamp: number, now: number = Date.now()): string => {
  const diff = now - timestamp
  if (diff < 0) return '刚刚'
  if (diff < MINUTE) return '刚刚'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} 分钟前`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} 小时前`
  return `${Math.floor(diff / DAY)} 天前`
}

/**
 * 由订单支付事件生成本地通知内容
 */
export const buildOrderNotification = (
  event: OrderPaidEvent
): Omit<NotificationStore.AppNotification, 'id' | 'createdAt' | 'read'> => ({
  type: 'order',
  title: '订单支付成功',
  content: `订单 ${event.orderNo} 支付 ¥${event.amount}，交易号 ${event.transactionNo}`,
  orderId: event.orderId,
  orderNo: event.orderNo,
})

/**
 * 通知列表点击跳转目标，非可跳转类型返回空字符串
 */
export const getNotificationRoute = (notification: NotificationStore.AppNotification): string => {
  if (notification.type === 'order') return '/order/list'
  return ''
}
