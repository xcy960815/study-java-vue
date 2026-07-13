import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearPaymentRequestId,
  consumeCheckoutDraft,
  getAvailableOrderActions,
  getOrCreatePaymentRequestId,
  getPaymentRequestStorageKey,
  saveCheckoutDraft,
  validatePlaceOrderRequest,
} from './order-workflow'

const createOrderRequest = (items: PlaceOrderItem[]): PlaceOrderRequest => ({
  userId: 1,
  userName: '张三',
  userPhone: '13800138000',
  userAddress: '杭州市西湖区',
  items,
})

describe('order workflow', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'request-id-1') })
  })

  it('accepts both single-product and multi-product orders', () => {
    expect(validatePlaceOrderRequest(createOrderRequest([{ goodsId: 1, quantity: 1 }]))).toBeNull()
    expect(
      validatePlaceOrderRequest(
        createOrderRequest([
          { goodsId: 1, quantity: 1 },
          { goodsId: 2, quantity: 2 },
        ])
      )
    ).toBeNull()
  })

  it.each([
    [{ ...createOrderRequest([{ goodsId: 1, quantity: 1 }]), userName: '' }, '收货人不能为空'],
    [
      { ...createOrderRequest([{ goodsId: 1, quantity: 1 }]), userPhone: '123' },
      '手机号必须是11位数字',
    ],
    [{ ...createOrderRequest([{ goodsId: 1, quantity: 1 }]), userAddress: '' }, '收货地址不能为空'],
    [createOrderRequest([]), '订单至少包含一个商品'],
    [createOrderRequest([{ goodsId: 1, quantity: 1000 }]), '订单商品参数不合法'],
  ])('rejects invalid place-order input before transport', (request, message) => {
    expect(validatePlaceOrderRequest(request as PlaceOrderRequest)).toBe(message)
  })

  it('reuses a payment request id until an explicit success clears it', () => {
    const first = getOrCreatePaymentRequestId(21, 2)
    const retry = getOrCreatePaymentRequestId(21, 2)

    expect(first).toBe('request-id-1')
    expect(retry).toBe(first)
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1)

    clearPaymentRequestId(21, 2)
    expect(sessionStorage.getItem(getPaymentRequestStorageKey(21, 2))).toBeNull()
  })

  it('keeps independent idempotency keys for different payment methods', () => {
    getOrCreatePaymentRequestId(21, 1)
    expect(sessionStorage.getItem(getPaymentRequestStorageKey(21, 1))).toBe('request-id-1')
    expect(sessionStorage.getItem(getPaymentRequestStorageKey(21, 2))).toBeNull()
  })

  it('only exposes legal actions for each status and none for closed orders', () => {
    expect(getAvailableOrderActions(0).map(({ action }) => action)).toEqual([
      'MANUAL_CLOSE',
      'MERCHANT_CLOSE',
    ])
    expect(getAvailableOrderActions(1).map(({ action }) => action)).toEqual(['PREPARE'])
    expect(getAvailableOrderActions(2).map(({ action }) => action)).toEqual(['SHIP'])
    expect(getAvailableOrderActions(3).map(({ action }) => action)).toEqual(['COMPLETE'])
    expect(getAvailableOrderActions(4)).toEqual([])
    expect(getAvailableOrderActions(-1)).toEqual([])
    expect(getAvailableOrderActions(-2)).toEqual([])
    expect(getAvailableOrderActions(-3)).toEqual([])
  })

  it('consumes a checkout draft exactly once', () => {
    const item: CheckoutDraftItem = {
      goodsId: 1,
      goodsName: '商品',
      sellingPrice: 500,
      stockNum: 10,
      quantity: 2,
    }
    saveCheckoutDraft([item])
    expect(consumeCheckoutDraft()).toEqual([item])
    expect(consumeCheckoutDraft()).toEqual([])
  })
})
