import { computed, ref } from 'vue'
import { goodsModule, orderModule } from '@apis'
import { getDailyReportData } from '@/apis/report'
import { usePermission } from '@/composables/usePermission'
import { buildOrderStatusPieData, getTopStockGoods } from '@/utils/dashboard-stats'
import { ORDER_STATUS_META } from '@/utils/order-workflow'

/**
 * 工作台数据聚合：纯前端统计，不依赖后端聚合接口
 * - 昨日订单/销售额：/monitor/report/daily（无权限要求）
 * - 订单总数/状态分布：getOrderList pageSize=1 只取 total（需要 order:query）
 * - 商品总数/库存 TOP：getGoodsList（需要 goods:query）
 */
export const useDashboardStats = () => {
  const { hasAnyPermi } = usePermission()

  const canQueryOrder = computed(() => hasAnyPermi(['order:query']))
  const canQueryGoods = computed(() => hasAnyPermi(['goods:query']))

  const statsLoading = ref(false)
  const dailyReport = ref<DailyReportVo>({ totalOrders: 0, totalRevenue: 0 })
  const orderTotal = ref(0)
  const goodsTotal = ref(0)
  const orderStatusPieData = ref<Array<{ name: string; value: number }>>([])
  const topStockGoods = ref<Array<{ name: string; value: number }>>([])
  const recentOrders = ref<OrderVo[]>([])

  const loadDailyReport = async () => {
    const res = await getDailyReportData()
    if (res) dailyReport.value = res
  }

  const loadOrderStats = async () => {
    const statuses = Object.keys(ORDER_STATUS_META).map((key) => Number(key) as OrderStatus)
    const statusTotals: Partial<Record<OrderStatus, number>> = {}
    let total = 0
    // 并行取各状态 total（pageSize=1 只要计数）
    const totals = await Promise.all(
      statuses.map((status) =>
        orderModule
          .getOrderList({ orderStatus: status, pageNum: 1, pageSize: 1 })
          .then((result) => result.total)
          .catch(() => 0)
      )
    )
    statuses.forEach((status, index) => {
      statusTotals[status] = totals[index]
      total += totals[index]
    })
    orderTotal.value = total
    orderStatusPieData.value = buildOrderStatusPieData(statusTotals)

    const recentResult = await orderModule.getOrderList({ pageNum: 1, pageSize: 8 })
    recentOrders.value = recentResult.data
  }

  const loadGoodsStats = async () => {
    const goodsResult = await goodsModule.getGoodsList({ pageNum: 1, pageSize: 50 })
    goodsTotal.value = goodsResult.total
    topStockGoods.value = getTopStockGoods(goodsResult.data, 8)
  }

  const loadDashboardStats = async () => {
    if (statsLoading.value) return
    statsLoading.value = true
    try {
      await Promise.all([
        loadDailyReport(),
        canQueryOrder.value ? loadOrderStats() : Promise.resolve(),
        canQueryGoods.value ? loadGoodsStats() : Promise.resolve(),
      ])
    } catch (error) {
      console.error('获取工作台数据失败:', error)
    } finally {
      statsLoading.value = false
    }
  }

  return {
    canQueryOrder,
    canQueryGoods,
    statsLoading,
    dailyReport,
    orderTotal,
    goodsTotal,
    orderStatusPieData,
    topStockGoods,
    recentOrders,
    loadDashboardStats,
  }
}
