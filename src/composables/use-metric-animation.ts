import { ref } from 'vue'

/**
 * 监控指标数字动画 composable。
 *
 * 配合 NumberFlow 实现指标数字的逐位弹簧滚动：首次出数先把展示值置 0，
 * 下一帧落到目标值触发入场滚动；后续快照值直接交给 NumberFlow 平滑过渡。
 * 系统开启“减少动态效果”偏好时由 NumberFlow 自动跳过动画直接落位。
 */
export const useMetricAnimation = () => {
  /** 各指标当前展示的数值（按指标键索引，null 表示无值可展示）。 */
  const animatedMetricValues = ref<Partial<Record<ServerMetricKey, number | null>>>({})

  /** 入场落位的延迟帧句柄，null 表示没有待落位任务。 */
  let settleFrameId: number | null = null

  /**
   * 取指标当前应展示的数值。
   *
   * @param metric - 指标对象
   * @returns 展示数值；无动画值或值非法时回退为指标当前值（null 按 0 处理）
   */
  const getAnimatedMetricNumber = (metric: ServerMetricValue): number => {
    const animatedValue = animatedMetricValues.value[metric.key]
    return typeof animatedValue === 'number' && Number.isFinite(animatedValue)
      ? animatedValue
      : (metric.value ?? 0)
  }

  /** 取消尚未执行的落位帧。 */
  const cancelSettleFrame = (): void => {
    if (settleFrameId !== null) {
      cancelAnimationFrame(settleFrameId)
      settleFrameId = null
    }
  }

  /**
   * 以最新快照值触发一轮数字过渡。
   *
   * 值为 null 或非有限数的指标直接置空展示；首次出数的指标先置 0，
   * 下一帧落到目标值，让 NumberFlow 从 0 滚入；已有展示值的指标保持当前值，
   * 由落位帧推到新目标值完成过渡。连续快照到来时会取消上一轮落位，直接落向最新值。
   *
   * @param metrics - 快照中的服务器指标列表
   */
  const animateMetricValues = (metrics: ServerMetricValue[]): void => {
    cancelSettleFrame()

    const nextValues = { ...animatedMetricValues.value }
    metrics.forEach((metric) => {
      const targetValue = metric.value
      if (targetValue === null || !Number.isFinite(targetValue)) {
        nextValues[metric.key] = null
        return
      }
      const currentValue = nextValues[metric.key]
      nextValues[metric.key] =
        typeof currentValue === 'number' && Number.isFinite(currentValue) ? currentValue : 0
    })
    animatedMetricValues.value = nextValues

    settleFrameId = requestAnimationFrame(() => {
      settleFrameId = null
      const settledValues = { ...animatedMetricValues.value }
      metrics.forEach((metric) => {
        if (metric.value !== null && Number.isFinite(metric.value)) {
          settledValues[metric.key] = metric.value
        }
      })
      animatedMetricValues.value = settledValues
    })
  }

  /** 取消落位帧，卸载时调用。 */
  const disposeMetricAnimation = (): void => {
    cancelSettleFrame()
  }

  return {
    /** 取指标当前应展示的数值 */
    getAnimatedMetricNumber,
    /** 以最新快照值触发一轮数字过渡 */
    animateMetricValues,
    /** 取消落位帧，卸载时调用 */
    disposeMetricAnimation,
  }
}
