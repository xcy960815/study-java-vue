<template>
  <div
    v-if="svgContent"
    v-html="svgContent"
    :style="{ width: `${size}px`, height: `${size}px`, fill }"
    class="svg-icon"
  />
</template>
<script lang="ts" setup>
import { computed, type PropType } from 'vue'
// 本地icon
import { svgIconContents, type SvgIconName } from '@assets/svg-icons'

const props = defineProps({
  type: {
    type: String as PropType<SvgIconName>,
    default: '',
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 24,
  },
  fill: {
    type: String as PropType<string>,
    default: 'currentColor', // 默认继承文本颜色
  },
})

const svgContent = computed(() => {
  if (!props.type) {
    return ''
  }

  return svgIconContents[props.type] || ''
})
</script>

<style scoped>
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: inherit;
  /* 让 fill 继承外部样式 */
}
</style>
