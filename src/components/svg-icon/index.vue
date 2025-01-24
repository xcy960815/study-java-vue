<template>
  <svg
    v-if="isExternalIcon"
    aria-hidden="true"
    class="svg-icon"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
  <component class="svg-icon" v-else :is="name"></component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import * as ElIcon from '@element-plus/icons-vue'
defineOptions({
  name: 'svg-icon'
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#fff'
  }
})

/**
 * 判断是否为外部图标
 * @returns { boolean }
 */
const isExternalIcon = computed(() => {
  const iconNames = Object.keys(ElIcon)
  const isExternal = !iconNames.includes(props.name)
  console.log('isExternal--isExternal', isExternal)

  return isExternal
})

const symbolId = computed(
  () => `#${props.prefix}-${props.name}`
)
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor;
}
</style>
