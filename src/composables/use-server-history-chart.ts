import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { markRaw, nextTick, ref, shallowRef, watch } from 'vue'
import { useSystemTheme } from '@/utils/system-style'

/** 读取图表主色（CSS 变量 --sj-primary，回退天青蓝）。 */
const getChartPrimaryColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue('--sj-primary').trim() || '#409EFF'
}

/** 读取图表文本颜色（CSS 变量 --el-text-color-regular，回退 #909399）。 */
const getChartTextColor = (): string => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--el-text-color-regular').trim() ||
    '#909399'
  )
}

/** 读取图表边框颜色（CSS 变量 --el-border-color，回退 #ebeef5）。 */
const getChartBorderColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue('--el-border-color').trim() || '#ebeef5'
}

/**
 * 服务监控历史趋势图表 composable。
 *
 * 管理 ECharts 实例与容器引用，负责趋势折线图渲染、主色/明暗主题联动重绘、
 * 窗口尺寸变化与销毁；供服务监控页使用。
 */
export const useServerHistoryChart = () => {
  /** 图表容器 DOM 引用，需绑定到模板中的图表节点。 */
  const chartRef = ref<HTMLDivElement | null>(null)

  /** ECharts 实例（markRaw 包裹，不做响应式代理）。 */
  const chartInstance = shallowRef<ECharts | null>(null)

  /** 最近一次渲染使用的历史数据，主题切换时用于原样重绘。 */
  let latestHistory: ServerMetricsHistoryVo | null = null

  /**
   * 渲染历史趋势折线图；容器不存在时不渲染。
   *
   * 首次调用时初始化 ECharts 实例；history 缺省时渲染空图表。
   *
   * @param history - 历史趋势数据，可选
   */
  const renderChart = (history?: ServerMetricsHistoryVo): void => {
    if (!chartRef.value) {
      return
    }

    latestHistory = history || null

    if (!chartInstance.value) {
      chartInstance.value = markRaw(echarts.init(chartRef.value))
    }

    const points = history?.points || []
    const unit = history?.unit || '%'
    const primaryColor = getChartPrimaryColor()

    chartInstance.value.setOption({
      animation: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontSize: 12,
      },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: number) => `${Number(value).toFixed(2)}${unit === '%' ? '%' : ''}`,
      },
      grid: {
        top: 26,
        right: 18,
        bottom: 36,
        left: 54,
      },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: getChartBorderColor() } },
        axisLabel: { color: getChartTextColor(), fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: getChartTextColor(),
          fontSize: 12,
          formatter: (value: number) => (unit === '%' ? `${value}%` : value),
        },
        splitLine: { lineStyle: { color: getChartBorderColor() } },
      },
      series: [
        {
          name: history?.label || '',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: primaryColor },
          areaStyle: { color: echarts.color.modifyAlpha(primaryColor, 0.14) },
          data: points.map((point) => [point.timestamp * 1000, point.value]),
        },
      ],
    })
  }

  /** 让图表实例自适应容器尺寸，窗口 resize 时由页面调用。 */
  const resizeChart = (): void => {
    chartInstance.value?.resize()
  }

  /** 销毁 ECharts 实例并清空引用，卸载时调用。 */
  const disposeChart = (): void => {
    chartInstance.value?.dispose()
    chartInstance.value = null
  }

  /** 主色或明暗模式变化时，等待 DOM 更新后按最新样式重绘图表。 */
  const themeState = useSystemTheme()
  watch(
    [() => themeState.resolvedPrimaryColor, () => themeState.isDark],
    async () => {
      await nextTick()
      renderChart(latestHistory || undefined)
    },
    { flush: 'post' }
  )

  return {
    /** 图表容器 DOM 引用 */
    chartRef,
    /** 渲染（或重绘）历史趋势折线图 */
    renderChart,
    /** 让图表自适应容器尺寸 */
    resizeChart,
    /** 销毁 ECharts 实例 */
    disposeChart,
  }
}
