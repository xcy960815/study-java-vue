import { describe, it, expect } from 'vitest'
import {
  getGreeting,
  buildOrderStatusPieData,
  getTopStockGoods,
} from './dashboard-stats'

describe('getGreeting', () => {
  it.each([
    ['夜深了', 2],
    ['早上好', 7],
    ['上午好', 10],
    ['中午好', 13],
    ['下午好', 16],
    ['晚上好', 20],
  ])('%s 点返回 %s', (expected, hour) => {
    expect(getGreeting(hour)).toBe(expected)
  })

  it('非法小时数返回默认问候', () => {
    expect(getGreeting(-1)).toBe('你好')
    expect(getGreeting(24)).toBe('你好')
  })
})

describe('buildOrderStatusPieData', () => {
  it('按状态生成图表数据并过滤零值', () => {
    const pieData = buildOrderStatusPieData({ 0: 5, 4: 3 })
    expect(pieData).toEqual([
      { name: '待支付', value: 5 },
      { name: '交易完成', value: 3 },
    ])
  })

  it('状态 key 不在 META 定义内时忽略', () => {
    const pieData = buildOrderStatusPieData({ 99: 1 } as Partial<Record<OrderStatus, number>>)
    expect(pieData).toEqual([])
  })
})

describe('getTopStockGoods', () => {
  const goodsList: Array<GoodsVo> = [
    { goodsName: 'A', stockNum: 10 } as GoodsVo,
    { goodsName: 'B', stockNum: 50 } as GoodsVo,
    { goodsName: 'C', stockNum: 30 } as GoodsVo,
    { goodsName: 'D', stockNum: 20 } as GoodsVo,
  ]

  it('按库存降序取 TOP N', () => {
    expect(getTopStockGoods(goodsList, 2)).toEqual([
      { name: 'B', value: 50 },
      { name: 'C', value: 30 },
    ])
  })

  it('不超过列表长度时不补齐', () => {
    expect(getTopStockGoods(goodsList.slice(0, 1), 3)).toEqual([{ name: 'A', value: 10 }])
  })

  it('不修改原数组', () => {
    getTopStockGoods(goodsList, 1)
    expect(goodsList[0].goodsName).toBe('A')
  })
})
