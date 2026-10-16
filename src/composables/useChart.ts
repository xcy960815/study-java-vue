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
  let resizeObserver: ResizeObserver | null = null
  /** 容器尚不可见（尺寸为 0）时暂存的数据 option，初始化后补渲染 */
  let pendingOption: EChartsOption | null = null

  const initChart = () => {
    if (chart || !chartRef.value) return
    chart = echarts.init(chartRef.value)
    chart.setOption(optionFactory())
    if (pendingOption) chart.setOption(pendingOption)
  }

  const setOption = (option: EChartsOption) => {
    pendingOption = option
    chart?.setOption(option)
  }

  const handleResize = () => {
    chart?.resize()
  }

  const hasSize = (el: HTMLElement) => el.clientWidth > 0 && el.clientHeight > 0

  onMounted(async () => {
    await nextTick()
    if (!chartRef.value) return
    // 容器可见时立即初始化；容器被 v-show/v-if 等隐藏时（尺寸为 0）交给 ResizeObserver，
    // 在首次变为非零尺寸时再初始化，避免 ECharts 以 0×0 创建画布导致图表永久空白。
    if (hasSize(chartRef.value)) {
      initChart()
    }
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        const grew =
          entries.length > 0 &&
          entries.some(
            (entry) => entry.contentRect.width > 0 && entry.contentRect.height > 0
          )
        if (!grew) return
        if (chart) {
          handleResize()
        } else if (chartRef.value && hasSize(chartRef.value)) {
          initChart()
        }
      })
      resizeObserver.observe(chartRef.value)
    }
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', handleResize)
    chart?.dispose()
    chart = null
  })

  return {
    chartRef,
    setOption,
  }
}
