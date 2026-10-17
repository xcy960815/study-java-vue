<template>
  <article class="metric-card" :class="`is-${metric.status}`">
    <div class="metric-card__label">{{ metric.label }}</div>
    <NumberFlow
      v-if="metric.value !== null"
      class="metric-card__value"
      :value="animatedValue"
      :format="METRIC_NUMBER_FORMAT"
      suffix="%"
      locales="zh-CN"
    />
    <div v-else class="metric-card__value">--</div>
    <div class="metric-card__footer">
      <span>实时采集</span>
      <span>{{ getStatusText(metric.status) }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * 服务监控指标卡：展示单个指标的标签、弹簧滚动数值与状态脚注。
 * 动画值由父级经 useMetricAnimation 按指标键计算后传入；无值时展示占位符。
 */
import NumberFlow from '@number-flow/vue'
import type { PropType } from 'vue'
import { getStatusText } from './monitor-presentation'

/** 指标数值的固定 2 位小数格式 */
const METRIC_NUMBER_FORMAT = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

defineProps({
  /** 卡片承载的指标对象（标签、数值、单位与状态） */
  metric: {
    type: Object as PropType<ServerMetricValue>,
    required: true,
  },
  /** 当前应展示的动画数值；无动画值时由父级回退为指标当前值 */
  animatedValue: {
    type: Number,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.metric-card {
  min-height: 130px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
  padding: 16px 20px;
  transition: border-color 0.3s ease;

  .metric-card__label {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .metric-card__value {
    margin-top: 14px;
    color: var(--el-text-color-primary);
    font-size: 34px;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  .metric-card__footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 14px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  &.is-warning {
    border-color: var(--el-color-warning);

    .metric-card__value {
      color: var(--el-color-warning);
    }
  }

  &.is-danger {
    border-color: var(--el-color-danger);

    .metric-card__value {
      color: var(--el-color-danger);
    }
  }

  &.is-unavailable {
    .metric-card__value {
      color: var(--el-text-color-disabled);
    }
  }
}
</style>
