import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 单个 ECharts 实例的生命周期封装：init / setOption / resize / dispose
 * 时序与 monitor/server 页面保持一致（onMounted + nextTick init，卸载时 dispose）
 * @param optionFactory 返回图表配置的工厂函数
 */
export const useChart = (optionFactory: () => EChartsOption) => {
  const chartRef: Ref<HTMLElement | undefined> = ref()
  let chart: echarts.ECharts | null = null

  const setOption = (option: EChartsOption) => {
    chart?.setOption(option)
  }

  const handleResize = () => {
    chart?.resize()
  }

  onMounted(async () => {
    await nextTick()
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value)
    chart.setOption(optionFactory())
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chart?.dispose()
    chart = null
  })

  return {
    chartRef,
    setOption,
  }
}
