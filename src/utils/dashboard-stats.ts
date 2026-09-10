import { ORDER_STATUS_META } from './order-workflow'

/**
 * 按时段返回问候语
 * @param hour 小时（0-23）
 */
export const getGreeting = (hour: number): string => {
  if (hour < 0 || hour > 23) return '你好'
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

/**
 * 订单状态分布图表数据（name/value 形态，直接喂给 ECharts pie series）
 * @param statusTotals 各状态 total 计数，key 为 OrderStatus
 */
export const buildOrderStatusPieData = (
  statusTotals: Partial<Record<OrderStatus, number>>
): Array<{ name: string; value: number }> =>
  Object.keys(ORDER_STATUS_META)
    .map((key) => Number(key) as OrderStatus)
    .map((status) => ({
      name: ORDER_STATUS_META[status].label,
      value: statusTotals[status] ?? 0,
    }))
    .filter((item) => item.value > 0)

/**
 * 商品库存 TOP N（降序）
 */
export const getTopStockGoods = (
  goodsList: Array<GoodsVo>,
  topN: number
): Array<{ name: string; value: number }> =>
  [...goodsList]
    .sort((a, b) => b.stockNum - a.stockNum)
    .slice(0, topN)
    .map((goods) => ({ name: goods.goodsName, value: goods.stockNum }))

/**
 * 环图颜色表（与主题色系一致）
 */
export const ORDER_STATUS_PIE_COLORS = [
  '#909399',
  '#a0cfff',
  '#b3d8ff',
  '#e6a23c',
  '#409EFF',
  '#53a8ff',
  '#79bbff',
  '#67C23A',
]
