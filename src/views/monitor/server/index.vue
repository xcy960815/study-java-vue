<template>
  <div class="server-monitor">
    <div class="monitor-header">
      <div class="header-title">
        <el-icon class="title-icon"><Monitor /></el-icon>
        <h2>服务器监控</h2>
      </div>
      <div class="header-actions">
        <el-tag v-if="isConnected" type="success" effect="dark">
          <el-icon><Connection /></el-icon>
          实时监控中
        </el-tag>
        <el-tag v-else type="info" effect="dark">
          <el-icon><Connection /></el-icon>
          未连接
        </el-tag>
        <el-button
          v-if="!isConnected"
          type="primary"
          :icon="VideoPlay"
          @click="startMonitor"
          :loading="loading"
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

    <!-- 监控图表 -->
    <div class="monitor-charts">
      <!-- CPU 使用率 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <Cpu theme="outline" size="20" />
            <span>CPU 使用率</span>
          </div>
        </template>
        <div ref="cpuChartRef" class="chart-container"></div>
      </el-card>

      <!-- 内存使用率 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <Histogram theme="outline" size="20" />
            <span>内存使用率</span>
          </div>
        </template>
        <div ref="memoryChartRef" class="chart-container"></div>
      </el-card>

      <!-- JVM 使用率 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <PieOne theme="outline" size="20" />
            <span>JVM 内存使用</span>
          </div>
        </template>
        <div ref="jvmChartRef" class="chart-container"></div>
      </el-card>

      <!-- 磁盘使用率 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <Folder theme="outline" size="20" />
            <span>磁盘使用率</span>
          </div>
        </template>
        <div ref="diskChartRef" class="chart-container"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { ElMessage } from 'element-plus'
import { Monitor, Connection, VideoPlay, VideoPause, Platform } from '@element-plus/icons-vue'
import { Cpu, Histogram, PieOne, Folder } from '@icon-park/vue-next'
import { getServerInfo, startServerMonitor, stopServerMonitor } from '@/apis/server-monitor'
import { WebSocketClient } from '@/utils/websocket'

const loading = ref(false)
const isConnected = ref(false)
const serverInfo = ref<ServerInfoVo | null>(null)

// 图表实例
const cpuChartRef = ref<HTMLElement>()
const memoryChartRef = ref<HTMLElement>()
const jvmChartRef = ref<HTMLElement>()
const diskChartRef = ref<HTMLElement>()

let cpuChart: ECharts | null = null
let memoryChart: ECharts | null = null
let jvmChart: ECharts | null = null
let diskChart: ECharts | null = null

// WebSocket 客户端
let wsClient: WebSocketClient | null = null

// 初始化图表
const initCharts = () => {
  if (cpuChartRef.value) {
    cpuChart = echarts.init(cpuChartRef.value)
    cpuChart.setOption(getCpuChartOption())
  }

  if (memoryChartRef.value) {
    memoryChart = echarts.init(memoryChartRef.value)
    memoryChart.setOption(getMemoryChartOption())
  }

  if (jvmChartRef.value) {
    jvmChart = echarts.init(jvmChartRef.value)
    jvmChart.setOption(getJvmChartOption())
  }

  if (diskChartRef.value) {
    diskChart = echarts.init(diskChartRef.value)
    diskChart.setOption(getDiskChartOption())
  }
}

// CPU 图表配置
const getCpuChartOption = () => ({
  tooltip: {
    formatter: '{b}: {c}%',
  },
  series: [
    {
      name: 'CPU',
      type: 'gauge',
      progress: {
        show: true,
        width: 18,
      },
      axisLine: {
        lineStyle: {
          width: 18,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999',
        },
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 12,
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 18,
        itemStyle: {
          borderWidth: 8,
        },
      },
      title: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        fontSize: 32,
        offsetCenter: [0, '70%'],
        formatter: '{value}%',
        color: 'inherit',
      },
      data: [
        {
          value: 0,
          name: 'CPU 使用率',
        },
      ],
    },
  ],
})

// 内存图表配置
const getMemoryChartOption = () => ({
  tooltip: {
    formatter: '{b}: {c}%',
  },
  series: [
    {
      name: '内存',
      type: 'gauge',
      progress: {
        show: true,
        width: 18,
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.3, '#67E0E3'],
            [0.7, '#37A2DA'],
            [1, '#FD666D'],
          ],
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999',
        },
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 12,
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 18,
        itemStyle: {
          borderWidth: 8,
          color: '#37A2DA',
        },
      },
      title: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        fontSize: 32,
        offsetCenter: [0, '70%'],
        formatter: '{value}%',
        color: 'inherit',
      },
      data: [
        {
          value: 0,
          name: '内存使用率',
        },
      ],
    },
  ],
})

// JVM 图表配置
const getJvmChartOption = () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} MB ({d}%)',
  },
  legend: {
    bottom: '5%',
    left: 'center',
  },
  series: [
    {
      name: 'JVM 内存',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: '已使用' },
        { value: 0, name: '空闲' },
      ],
    },
  ],
})

// 磁盘图表配置
const getDiskChartOption = () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} GB ({d}%)',
  },
  legend: {
    bottom: '5%',
    left: 'center',
  },
  series: [
    {
      name: '磁盘',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: '已使用', itemStyle: { color: '#91cc75' } },
        { value: 0, name: '可用空间', itemStyle: { color: '#e0e0e0' } },
      ],
    },
  ],
})

// 更新图表数据
const updateCharts = (data: ServerInfoVo) => {
  serverInfo.value = data

  // 更新 CPU 图表
  cpuChart?.setOption({
    series: [
      {
        data: [{ value: data.cpu.used }],
      },
    ],
  })

  // 更新内存图表
  memoryChart?.setOption({
    series: [
      {
        data: [{ value: data.memory.usage }],
      },
    ],
  })

  // 更新 JVM 图表
  jvmChart?.setOption({
    series: [
      {
        data: [
          { value: data.jvm.used, name: '已使用' },
          { value: data.jvm.free, name: '空闲' },
        ],
      },
    ],
  })

  // 更新磁盘图表
  diskChart?.setOption({
    series: [
      {
        data: [
          { value: data.disk.used, name: '已使用' },
          { value: data.disk.free, name: '可用空间' },
        ],
      },
    ],
  })
}

// 开始监控
const startMonitor = async () => {
  loading.value = true
  try {
    // 调用后端 API 开始推送
    await startServerMonitor()

    // 连接 WebSocket
    const apiPrefix = import.meta.env.VITE_API_DOMAIN_PREFIX || '/dev-api'
    const prefix = apiPrefix.startsWith('/') ? apiPrefix : `/${apiPrefix}`
    const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix

    const wsUrl = `${window.location.protocol}//${window.location.host}${cleanPrefix}/ws/server-monitor`

    wsClient = new WebSocketClient(wsUrl)
    wsClient.connect(
      (data) => {
        // 收到数据，更新图表
        updateCharts(data)
      },
      () => {
        // 连接成功
        isConnected.value = true
        ElMessage.success('开始监控')
      },
      (error) => {
        // 连接错误
        console.error('WebSocket 错误:', error)
        ElMessage.error('连接失败')
        isConnected.value = false
      }
    )
  } catch (error) {
    console.error('开始监控失败:', error)
    ElMessage.error('开始监控失败')
  } finally {
    loading.value = false
  }
}

// 停止监控
const stopMonitor = async () => {
  try {
    // 断开 WebSocket
    wsClient?.disconnect()
    wsClient = null
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
    updateCharts(response)
  } catch (error) {
    console.error('加载服务器信息失败:', error)
    ElMessage.error('加载服务器信息失败')
  }
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  cpuChart?.resize()
  memoryChart?.resize()
  jvmChart?.resize()
  diskChart?.resize()
}

onMounted(async () => {
  await nextTick()
  initCharts()
  loadInitialData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理资源
  if (isConnected.value) {
    stopMonitor()
  }
  cpuChart?.dispose()
  memoryChart?.dispose()
  jvmChart?.dispose()
  diskChart?.dispose()
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
        color: var(--el-color-primary);
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

      .el-tag {
        padding: 8px 16px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  .system-info-card {
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    :deep(.el-card__header) {
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

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

  .monitor-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 20px;

    .chart-card {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      :deep(.el-card__header) {
        padding: 16px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

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

      .chart-container {
        width: 100%;
        height: 350px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .monitor-charts {
    grid-template-columns: 1fr;
  }
}
</style>
