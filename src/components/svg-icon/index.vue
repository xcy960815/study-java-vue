<template>
  <div class="svg-icon mr-1">
    <svg v-if="isLocalIcon" :height="size" :width="size" aria-hidden="true" :class="`local-icon-${name}`">
      <use :xlink:href="symbolId" :fill="fill" />
    </svg>
    <component :is="name" v-if="isIconParkIcon" :theme="theme" :size="size" :fill="fill" />
  </div>
</template>

<script lang="ts" setup>

import { computed, type PropType } from 'vue'

import * as ElIcons from '@element-plus/icons-vue'

import { localIcons } from '@assets/svg-icons'

import { type Theme } from "@icon-park/vue-next/lib/runtime";

import * as IconParkAll from "@icon-park/vue-next";

const { IconProvider, DEFAULT_ICON_CONFIGS, ...IconParkIcons } = IconParkAll

type IconParkNames = Exclude<keyof typeof IconParkIcons, "IconProvider" | "DEFAULT_ICON_CONFIGS">

type LocalIconNames = keyof typeof localIcons

defineOptions({
  name: 'svg-icon'
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String as PropType<LocalIconNames | IconParkNames>,
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
const isLocalIcon = computed(() => {
  const iconNames = Object.keys(localIcons)
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

const symbolId = computed(
  () => `#${props.prefix}-${props.name}`
)
</script>

<style lang="less" scoped>
.svg-icon {
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor;
}
</style>
