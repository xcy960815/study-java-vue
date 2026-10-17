<template>
  <div class="server-monitor">
    <div class="monitor-header">
      <div class="header-title">
        <el-icon class="title-icon"><Monitor /></el-icon>
        <h2>服务器监控</h2>
        <el-tag :type="isConnected ? 'success' : 'info'" effect="light">
          {{ isConnected ? '实时监控中' : '未连接' }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button
          v-if="!isConnected"
          type="primary"
          :icon="VideoPlay"
          :loading="loading"
          @click="startMonitor()"
        >
          开始监控
        </el-button>
        <el-button v-else type="danger" :icon="VideoPause" @click="stopMonitor">
          停止监控
        </el-button>
      </div>
    </div>

    <!-- 系统基础信息 -->
    <el-card class="system-info-card" v-if="serverInfo">
      <template #header>
        <div class="card-header">
          <el-icon><Platform /></el-icon>
          <span>系统信息</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作系统">
          {{ serverInfo.sys.os }}
        </el-descriptions-item>
        <el-descriptions-item label="系统架构">
          {{ serverInfo.sys.arch }}
        </el-descriptions-item>
        <el-descriptions-item label="主机名">
          {{ serverInfo.sys.hostname }}
        </el-descriptions-item>
        <el-descriptions-item label="IP 地址">
          {{ serverInfo.sys.ip }}
        </el-descriptions-item>
        <el-descriptions-item label="CPU 型号" :span="2">
          {{ serverInfo.cpu.cpuModel }}
        </el-descriptions-item>
        <el-descriptions-item label="CPU 核心数">
          {{ serverInfo.cpu.cpuNum }} 核
        </el-descriptions-item>
        <el-descriptions-item label="JVM 版本">
          {{ serverInfo.jvm.version }}
        </el-descriptions-item>
        <el-descriptions-item label="启动时间">
          {{ serverInfo.jvm.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="运行时长">
          {{ serverInfo.jvm.runTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 指标卡（快捷选择暗色主题时同样联动：数值与描边用 Element 状态色） -->
    <div class="metric-cards">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.key"
        :metric="metric"
        :animated-value="getAnimatedMetricNumber(metric)"
      />
    </div>

    <!-- 历史趋势 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header history-header">
          <span class="history-title">历史趋势</span>
          <div class="history-controls">
            <el-select v-model="selectedMetricKey" class="metric-select" @change="refreshHistory">
              <el-option
                v-for="option in METRIC_OPTIONS"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-segmented
              v-model="selectedRange"
              :options="RANGE_OPTIONS"
              @change="refreshHistory"
            />
          </div>
        </div>
      </template>
      <div v-loading="loadingHistory" class="history-chart-wrap">
        <div ref="historyChartRef" class="history-chart"></div>
        <el-empty
          v-if="!loadingHistory && historyPoints.length === 0"
          description="暂无趋势数据"
          class="history-empty"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 服务监控页：系统信息 + 实时指标卡（WebSocket 推送驱动数字滚动）+ 历史趋势图。
 * 历史数据来自后端每分钟的采样任务（ StudyJavaServerMetricsService ）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Monitor, VideoPlay, VideoPause, Platform } from '@element-plus/icons-vue'
import MetricCard from './metric-card.vue'
import {
  METRIC_OPTIONS,
  RANGE_OPTIONS,
  buildEmptyServerMetrics,
  serverInfoToMetrics,
} from './monitor-presentation'
import { useMetricAnimation } from '@/composables/use-metric-animation'
import { useServerHistoryChart } from '@/composables/use-server-history-chart'
import {
  getServerInfo,
  startServerMonitor,
  stopServerMonitor,
  getServerMetricsHistory,
} from '@/apis/server-monitor'
import { getSharedWebSocketClient } from '@/utils/websocket'

const { getAnimatedMetricNumber, animateMetricValues, disposeMetricAnimation } = useMetricAnimation()
const {
  chartRef: historyChartRef,
  renderChart,
  resizeChart,
  disposeChart,
} = useServerHistoryChart()

const loading = ref(false)
const isConnected = ref(false)
const serverInfo = ref<ServerInfoVo | null>(null)
const metrics = ref<ServerMetricValue[]>(buildEmptyServerMetrics())

/** 历史趋势当前选中的指标键。 */
const selectedMetricKey = ref<ServerMetricKey>('cpu_usage')
/** 历史趋势当前选中的时间范围（秒），默认 1 小时。 */
const selectedRange = ref(3600)
/** 历史趋势请求进行中标记。 */
const loadingHistory = ref(false)
/** 当前趋势点序列，用于图表空态判断。 */
const historyPoints = ref<ServerMetricsHistoryPoint[]>([])

// 与订单通知共用同一个 STOMP 连接，仅独立管理本页的监控订阅。
let unsubscribeServerMonitor: (() => void) | null = null

/**
 * 用服务器信息快照刷新系统信息与指标卡，并驱动数字滚动。
 *
 * @param info - WebSocket 推送或首次拉取的快照
 */
const applyServerInfo = (info: ServerInfoVo) => {
  serverInfo.value = info
  const nextMetrics = serverInfoToMetrics(info)
  metrics.value = nextMetrics
  animateMetricValues(nextMetrics)
}

/**
 * 开始监控。进场时由 onMounted 自动触发（silent=true），不打扰提示；
 * 自动开始失败时页面回到手动「开始监控」按钮态，可点击重试。
 *
 * @param silent - 静默模式，不弹开始成功/失败与连接失败提示
 */
const startMonitor = async (silent = false) => {
  loading.value = true
  try {
    // 调用后端 API 开始推送
    await startServerMonitor()

    unsubscribeServerMonitor?.()
    unsubscribeServerMonitor = getSharedWebSocketClient().subscribe<ServerInfoVo>(
      '/topic/server-monitor',
      (data) => {
        applyServerInfo(data)
        isConnected.value = true
      },
      (error) => {
        console.error('WebSocket 错误:', error)
        isConnected.value = false
        if (!silent) ElMessage.error('连接失败')
      }
    )
    isConnected.value = true
    if (!silent) ElMessage.success('开始监控')
  } catch (error) {
    console.error('开始监控失败:', error)
    if (!silent) ElMessage.error('开始监控失败')
  } finally {
    loading.value = false
  }
}

// 停止监控
const stopMonitor = async () => {
  try {
    unsubscribeServerMonitor?.()
    unsubscribeServerMonitor = null
    isConnected.value = false

    // 调用后端 API 停止推送
    await stopServerMonitor()
    ElMessage.success('停止监控')
  } catch (error) {
    console.error('停止监控失败:', error)
    ElMessage.error('停止监控失败')
  }
}

// 加载初始数据
const loadInitialData = async () => {
  try {
    const response = await getServerInfo()
    applyServerInfo(response)
  } catch (error) {
    console.error('加载服务器信息失败:', error)
    ElMessage.error('加载服务器信息失败')
  }
}

// 加载历史趋势
const refreshHistory = async () => {
  loadingHistory.value = true
  const end = Math.floor(Date.now() / 1000)
  const start = end - selectedRange.value
  try {
    const response = await getServerMetricsHistory(selectedMetricKey.value, start, end)
    historyPoints.value = response.points || []
    renderChart(response)
  } catch (error) {
    console.error('加载历史趋势失败:', error)
    historyPoints.value = []
    renderChart()
  } finally {
    loadingHistory.value = false
  }
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  resizeChart()
}

onMounted(async () => {
  await nextTick()
  loadInitialData()
  refreshHistory()
  // 进场自动开始监控（静默模式），无需手动点击
  startMonitor(true)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理资源
  if (isConnected.value) {
    stopMonitor()
  }
  unsubscribeServerMonitor?.()
  unsubscribeServerMonitor = null
  disposeMetricAnimation()
  disposeChart()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.server-monitor {
  padding: 20px;

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        font-size: 28px;
        color: var(--sj-primary);
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .system-info-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;

      .el-icon {
        font-size: 20px;
      }
    }
  }

  .metric-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  .history-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
    }

    .history-header {
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .history-controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .metric-select {
      width: 220px;
    }

    .history-chart-wrap {
      position: relative;
      min-height: 320px;
    }

    .history-chart {
      height: 320px;
    }

    .history-empty {
      position: absolute;
      inset: 0;
      background: color-mix(in srgb, var(--el-bg-color) 80%, transparent);
    }
  }
}

@media (max-width: 760px) {
  .server-monitor .monitor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
