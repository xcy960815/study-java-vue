<template>
  <div class="svg-icon mr-1">
    <SvgIcon
      v-if="isSvgIcon"
      :type="svgIconName"
      :theme="theme"
      :size="size"
      :fill="fill"
    ></SvgIcon>
    <IconPark
      v-if="isIconParkIcon"
      :type="iconParkName"
      :theme="theme"
      :size="size"
      :fill="fill"
    ></IconPark>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@components/svg-icon/index.vue'

import { IconPark } from '@icon-park/vue-next/es/all'

import { computed, type PropType } from 'vue'

// 本地icon
import { svgIcons } from '@assets/svg-icons'

import { type Theme } from '@icon-park/vue-next/lib/runtime'

import * as IconParkAll from '@icon-park/vue-next'

const { IconProvider, DEFAULT_ICON_CONFIGS, ...IconParkIcons } = IconParkAll

type IconParkNames = Exclude<keyof typeof IconParkIcons, 'IconProvider' | 'DEFAULT_ICON_CONFIGS'>

type SvgIconNames = keyof typeof svgIcons

defineOptions({
  name: 'icon',
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String as PropType<SvgIconNames | IconParkNames>,
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
  const iconNames = Object.keys(svgIcons)
  return iconNames.includes(props.name)
})

/**
 * 判断是否为 IconPark 图标
 * @returns { boolean }
 */
const isIconParkIcon = computed(() => {
  const iconNames = Object.keys(IconParkIcons)
  return iconNames.includes(props.name)
})

/**
 * 获取SVG图标名称（类型安全）
 */
const svgIconName = computed(() => {
  return isSvgIcon.value ? (props.name as SvgIconNames) : undefined
})

/**
 * 获取 IconPark 图标名称（类型安全）
 */
const iconParkName = computed(() => {
  return isIconParkIcon.value ? (props.name as IconParkNames) : ('' as IconParkNames)
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
