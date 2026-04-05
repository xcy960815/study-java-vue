<template>
  <div class="svg-icon mr-1">
    <SvgIcon v-if="svgIconName" :type="svgIconName" :size="size" :fill="fill"></SvgIcon>
    <component
      :is="iconParkComponent"
      v-else-if="iconParkComponent"
      :theme="theme"
      :size="size"
      :fill="fill"
    />
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@components/svg-icon/index.vue'

import { computed, type PropType } from 'vue'

// 本地icon
import { svgIcons, type SvgIconName } from '@assets/svg-icons'

import { type Theme } from '@icon-park/vue-next/lib/runtime'

import { getIconParkIcon } from '@/utils/icon-park'

defineOptions({
  name: 'icon',
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String as PropType<string>,
    required: true,
  },

  fill: {
    type: String,
    default: '#333',
  },
  theme: {
    type: String as PropType<Theme>,
    default: 'outline',
  },
  size: {
    type: Number,
    default: 14,
  },
})

/**
 * 判断是否为外部图标
 * @returns { boolean }
 */
const isSvgIcon = computed(() => {
  return props.name in svgIcons
})

/**
 * 获取SVG图标名称（类型安全）
 */
const svgIconName = computed(() => {
  return isSvgIcon.value ? (props.name as SvgIconName) : undefined
})

const iconParkComponent = computed(() => {
  if (isSvgIcon.value) {
    return null
  }

  return getIconParkIcon(props.name)
})
</script>

<style lang="less" scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  .i-icon {
    display: inline-flex;
    align-items: center;
  }
}
</style>
