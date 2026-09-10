import { describe, it, expect } from 'vitest'
import {
  formatRelativeTime,
  buildOrderNotification,
  getNotificationRoute,
} from './notification'

const NOW = 1_700_000_000_000

describe('formatRelativeTime', () => {
  it.each([
    ['刚刚', NOW],
    ['刚刚', NOW - 30_000],
    ['5 分钟前', NOW - 5 * 60_000],
    ['59 分钟前', NOW - 59 * 60_000],
    ['1 小时前', NOW - 3600_000],
    ['23 小时前', NOW - 23 * 3600_000],
    ['1 天前', NOW - 24 * 3600_000],
    ['3 天前', NOW - 3 * 24 * 3600_000],
  ])('格式化为 %s', (expected, timestamp) => {
    expect(formatRelativeTime(timestamp, NOW)).toBe(expected)
  })

  it('未来时间按刚刚处理', () => {
    expect(formatRelativeTime(NOW + 5000, NOW)).toBe('刚刚')
  })
})

describe('buildOrderNotification', () => {
  it('由订单支付事件生成通知内容', () => {
    const event: OrderPaidEvent = {
      orderId: 1,
      orderNo: 'NO123',
      userId: 2,
      amount: 99.5,
      paymentType: 1,
      transactionNo: 'TX888',
    }
    const notification = buildOrderNotification(event)
    expect(notification.type).toBe('order')
    expect(notification.title).toBe('订单支付成功')
    expect(notification.content).toBe('订单 NO123 支付 ¥99.5，交易号 TX888')
    expect(notification.orderId).toBe(1)
    expect(notification.orderNo).toBe('NO123')
  })
})

describe('getNotificationRoute', () => {
  it('订单通知跳转订单列表', () => {
    const notification: NotificationStore.AppNotification = {
      id: 'n1',
      type: 'order',
      title: '订单支付成功',
      content: '',
      createdAt: NOW,
      read: false,
    }
    expect(getNotificationRoute(notification)).toBe('/order/list')
  })
})
