<template>
  <div v-loading="statsLoading" class="dashboard-page p-6">
    <!-- 问候区 -->
    <div class="greeting-section mb-6">
      <h2 class="text-2xl font-bold">{{ greeting }}，{{ userInfo.nickName }}</h2>
      <p class="text-gray-500 text-sm mt-1">欢迎回到工作台，这是今天的概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <div class="stat-card__icon is-blue">
          <el-icon :size="28"><ShoppingCart /></el-icon>
        </div>
        <div>
          <p class="stat-card__label">昨日订单总数</p>
          <p class="stat-card__value">{{ dailyReport.totalOrders }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon is-green">
          <el-icon :size="28"><Coin /></el-icon>
        </div>
        <div>
          <p class="stat-card__label">昨日销售总额</p>
          <p class="stat-card__value">¥ {{ dailyReport.totalRevenue }}</p>
        </div>
      </div>
      <div v-if="canQueryOrder" class="stat-card">
        <div class="stat-card__icon is-orange">
          <el-icon :size="28"><Tickets /></el-icon>
        </div>
        <div>
          <p class="stat-card__label">订单总数</p>
          <p class="stat-card__value">{{ orderTotal }}</p>
        </div>
      </div>
      <div v-if="canQueryGoods" class="stat-card">
        <div class="stat-card__icon is-purple">
          <el-icon :size="28"><Goods /></el-icon>
        </div>
        <div>
          <p class="stat-card__label">商品总数</p>
          <p class="stat-card__value">{{ goodsTotal }}</p>
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <div v-if="canQueryOrder" class="chart-card">
        <h3 class="chart-card__title">订单状态分布</h3>
        <div v-show="orderStatusPieData.length > 0" ref="statusChartRef" class="chart-card__container"></div>
        <el-empty v-if="orderStatusPieData.length === 0" description="暂无订单数据" :image-size="60" />
      </div>
      <div v-if="canQueryGoods" class="chart-card">
        <h3 class="chart-card__title">商品库存 TOP 8</h3>
        <div v-show="topStockGoods.length > 0" ref="stockChartRef" class="chart-card__container"></div>
        <el-empty v-if="topStockGoods.length === 0" description="暂无商品数据" :image-size="60" />
      </div>
    </div>

    <!-- 最近订单 -->
    <div v-if="canQueryOrder" class="chart-card">
      <div class="flex items-center justify-between mb-2">
        <h3 class="chart-card__title">最近订单</h3>
        <el-button link type="primary" @click="router.push('/order/list')">查看全部</el-button>
      </div>
      <el-table :data="recentOrders" border>
        <el-table-column align="center" prop="orderNo" label="订单号" min-width="180" />
        <el-table-column align="center" prop="userName" label="收货人" min-width="90" />
        <el-table-column align="center" prop="totalPrice" label="金额" min-width="90">
          <template #default="{ row }">¥ {{ row.totalPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单状态" min-width="90">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusMeta(row.orderStatus).tagType">
              {{ getOrderStatusMeta(row.orderStatus).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" min-width="160" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { EChartsOption } from 'echarts'
import { Coin, Goods, ShoppingCart, Tickets } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@store'
import { useChart } from '@/composables/useChart'
import { useDashboardStats } from '@/composables/useDashboardStats'
import { ORDER_STATUS_PIE_COLORS, getGreeting } from '@/utils/dashboard-stats'
import { getOrderStatusMeta } from '@/utils/order-workflow'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.$state)

const {
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
} = useDashboardStats()

const greeting = computed(() => {
  const hour = new Date().getHours()
  return getGreeting(hour)
})

const buildStatusPieOption = (): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, type: 'scroll' },
  color: ORDER_STATUS_PIE_COLORS,
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4 },
      label: { show: false },
      data: [],
    },
  ],
})

const buildStockBarOption = (): EChartsOption => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
  xAxis: { type: 'value' },
  yAxis: {
    type: 'category',
    inverse: true,
    axisLabel: { width: 90, overflow: 'truncate' },
    data: [],
  },
  series: [{ type: 'bar', barMaxWidth: 20, data: [] }],
})

const { chartRef: statusChartRef, setOption: setStatusOption } = useChart(buildStatusPieOption)
const { chartRef: stockChartRef, setOption: setStockOption } = useChart(buildStockBarOption)

watch(orderStatusPieData, (data) => {
  setStatusOption({ series: [{ data }] } as EChartsOption)
})

watch(topStockGoods, (data) => {
  setStockOption({
    yAxis: { data: data.map((item) => item.name) },
    series: [{ data: data.map((item) => item.value) }],
  } as EChartsOption)
})

onMounted(() => {
  loadDashboardStats()
})
</script>

<style lang="less" scoped>
.dashboard-page {
  .greeting-section {
    :deep(h2) {
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }

  .stat-card {
    display: flex;
    align-items: center;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
    padding: 24px;

    .stat-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      min-width: 56px;
      border-radius: 50%;
      margin-right: 16px;

      &.is-blue {
        background-color: var(--el-color-primary-light-8);
        color: var(--el-color-primary);
      }

      &.is-green {
        background-color: var(--el-color-success-light-8);
        color: var(--el-color-success);
      }

      &.is-orange {
        background-color: var(--el-color-warning-light-8);
        color: var(--el-color-warning);
      }

      &.is-purple {
        background-color: #6979c933;
        color: #6979c9;
      }
    }

    .stat-card__label {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .stat-card__value {
      margin: 4px 0 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }
  }

  .chart-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
    padding: 20px;

    .chart-card__title {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .chart-card__container {
      height: 320px;
    }
  }
}
</style>
