<template>
  <div class="svg-icon mr-1">
    <!-- <svg v-if="isSvgIcon" :height="size" :width="size" aria-hidden="true" :class="`local-icon-${name}`">
            <use :xlink:href="symbolId" :fill="fill" />
        </svg> -->
    <SvgIcon v-if="isSvgIcon" :type="name as SvgIconNames" :theme="theme" :size="size" :fill="fill"></SvgIcon>

    <!-- <component :is="name" v-if="isIconParkIcon" :theme="theme" :size="size" :fill="fill" /> -->
    <!-- 使用 IconPark 代替 component 就不用注册全局组件了 -->
    <IconPark v-if="isIconParkIcon" :type="name" :theme="theme" :size="size" :fill="fill"></IconPark>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@components/svg-icon/index.vue'

import { IconPark } from '@icon-park/vue-next/es/all'

import { computed, type PropType } from 'vue'

import * as ElIcons from '@element-plus/icons-vue'

// 本地icon
import { svgIcons } from '@assets/svg-icons'

import { type Theme } from '@icon-park/vue-next/lib/runtime'

import * as IconParkAll from '@icon-park/vue-next'

const { IconProvider, DEFAULT_ICON_CONFIGS, ...IconParkIcons } = IconParkAll

type IconParkNames = Exclude<keyof typeof IconParkIcons, 'IconProvider' | 'DEFAULT_ICON_CONFIGS'>

type SvgIconNames = keyof typeof svgIcons

defineOptions({
  name: 'icon'
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String as PropType<SvgIconNames | IconParkNames>,
    required: true
  },
  // fill: {
  //   type: [String, Array] as PropType<string | string[]>,
  //   default: ['#333', '#eeff2f'] //'#333'
  // },
  fill: {
    type: String,
    default: '#333'
  },
  // theme: {
  //   type: String as PropType<Theme>,
  //   default: 'two-tone'
  // },
  theme: {
    type: String as PropType<Theme>,
    default: 'outline'
  },
  size: {
    type: Number,
    default: 14
  }
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
 * 判断是否为 ElIcon 图标
 * @returns { boolean }
 */
const isElIcon = computed(() => {
  const iconNames = Object.keys(ElIcons)
  return iconNames.includes(props.name)
})

const isIconParkIcon = computed(() => {
  const iconNames = Object.keys(IconParkIcons)
  return iconNames.includes(props.name)
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="less" scoped>
.svg-icon {
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor;
}
</style>
