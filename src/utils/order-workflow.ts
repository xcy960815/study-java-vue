export type OrderTagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'

export interface OrderStatusMeta {
  label: string
  tagType: OrderTagType
}

export interface OrderActionMeta {
  action: OrderAction
  label: string
  confirmMessage: string
  type: 'primary' | 'success' | 'warning' | 'danger'
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  [-3]: { label: '商家关闭', tagType: 'info' },
  [-2]: { label: '超时关闭', tagType: 'info' },
  [-1]: { label: '手动关闭', tagType: 'info' },
  0: { label: '待支付', tagType: 'warning' },
  1: { label: '已支付', tagType: 'primary' },
  2: { label: '配货完成', tagType: 'primary' },
  3: { label: '已出库', tagType: 'primary' },
  4: { label: '交易完成', tagType: 'success' },
}

export const PAY_STATUS_META: Record<PayStatus, OrderStatusMeta> = {
  [-1]: { label: '支付失败', tagType: 'danger' },
  0: { label: '未支付', tagType: 'warning' },
  1: { label: '支付成功', tagType: 'success' },
}

export const PAYMENT_TYPE_LABEL: Record<0 | PaymentType, string> = {
  0: '未选择',
  1: '支付宝',
  2: '微信支付',
}

export const getOrderStatusMeta = (status: number) =>
  ORDER_STATUS_META[status as OrderStatus] ?? { label: `未知状态（${status}）`, tagType: 'info' }

export const getPayStatusMeta = (status: number) =>
  PAY_STATUS_META[status as PayStatus] ?? { label: `未知状态（${status}）`, tagType: 'info' }

export const getPaymentTypeLabel = (payType: number) =>
  PAYMENT_TYPE_LABEL[payType as 0 | PaymentType] ?? `未知方式（${payType}）`

const ACTION_META: Record<OrderAction, OrderActionMeta> = {
  PREPARE: {
    action: 'PREPARE',
    label: '配货',
    confirmMessage: '确认该订单已配货完成吗？',
    type: 'primary',
  },
  SHIP: {
    action: 'SHIP',
    label: '发货',
    confirmMessage: '确认该订单已经出库吗？',
    type: 'success',
  },
  COMPLETE: {
    action: 'COMPLETE',
    label: '完成',
    confirmMessage: '确认完成该订单交易吗？',
    type: 'success',
  },
  MANUAL_CLOSE: {
    action: 'MANUAL_CLOSE',
    label: '手动关闭',
    confirmMessage: '确认手动关闭该待支付订单吗？',
    type: 'danger',
  },
  TIMEOUT_CLOSE: {
    action: 'TIMEOUT_CLOSE',
    label: '超时关闭',
    confirmMessage: '确认以超时原因关闭该待支付订单吗？',
    type: 'warning',
  },
  MERCHANT_CLOSE: {
    action: 'MERCHANT_CLOSE',
    label: '商家关闭',
    confirmMessage: '确认由商家关闭该待支付订单吗？',
    type: 'danger',
  },
}

export const getAvailableOrderActions = (
  status: OrderStatus,
  includeTimeoutClose = false
): OrderActionMeta[] => {
  if (status === 0) {
    const actions = [ACTION_META.MANUAL_CLOSE, ACTION_META.MERCHANT_CLOSE]
    return includeTimeoutClose ? [...actions, ACTION_META.TIMEOUT_CLOSE] : actions
  }
  if (status === 1) return [ACTION_META.PREPARE]
  if (status === 2) return [ACTION_META.SHIP]
  if (status === 3) return [ACTION_META.COMPLETE]
  return []
}

const PAYMENT_REQUEST_ID_PREFIX = 'paymentRequestId'
const CHECKOUT_DRAFT_KEY = 'orderCheckoutDraft'

export const getPaymentRequestStorageKey = (orderId: number, payType: PaymentType) =>
  `${PAYMENT_REQUEST_ID_PREFIX}:${orderId}:${payType}`

export const getOrCreatePaymentRequestId = (
  orderId: number,
  payType: PaymentType,
  storage: Pick<Storage, 'getItem' | 'setItem'> = sessionStorage
) => {
  const key = getPaymentRequestStorageKey(orderId, payType)
  const existingRequestId = storage.getItem(key)
  if (existingRequestId) return existingRequestId
  const requestId = crypto.randomUUID()
  storage.setItem(key, requestId)
  return requestId
}

export const clearPaymentRequestId = (
  orderId: number,
  payType: PaymentType,
  storage: Pick<Storage, 'removeItem'> = sessionStorage
) => storage.removeItem(getPaymentRequestStorageKey(orderId, payType))

export const saveCheckoutDraft = (items: CheckoutDraftItem[]) => {
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(items))
}

export const consumeCheckoutDraft = (): CheckoutDraftItem[] => {
  const value = sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
  if (!value) return []
  try {
    const items = JSON.parse(value) as CheckoutDraftItem[]
    return Array.isArray(items) ? items.slice(0, 50) : []
  } catch {
    return []
  }
}

export const getRequestErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) return ''
  const candidate = error as {
    message?: string
    response?: { data?: { message?: string } }
  }
  return candidate.response?.data?.message || candidate.message || ''
}

export const isOrderStateConflict = (error: unknown) => {
  const message = getRequestErrorMessage(error)
  return message.includes('状态') || message.includes('订单不存在')
}

export const validatePlaceOrderRequest = (request: PlaceOrderRequest): string | null => {
  if (!request.userId || request.userId <= 0) return '当前登录用户信息无效'
  if (!request.userName.trim()) return '收货人不能为空'
  if (request.userName.length > 30) return '收货人不能超过30个字符'
  if (!/^\d{11}$/.test(request.userPhone)) return '手机号必须是11位数字'
  if (!request.userAddress.trim()) return '收货地址不能为空'
  if (request.userAddress.length > 100) return '收货地址不能超过100个字符'
  if (request.items.length === 0) return '订单至少包含一个商品'
  if (request.items.length > 50) return '一个订单最多包含50种商品'
  if (request.items.some((item) => item.goodsId <= 0 || item.quantity < 1 || item.quantity > 999)) {
    return '订单商品参数不合法'
  }
  if (new Set(request.items.map((item) => item.goodsId)).size !== request.items.length) {
    return '订单中不能重复添加同一商品'
  }
  return null
}
