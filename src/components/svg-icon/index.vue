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
import { computed, type PropType } from 'vue'
import * as ElIcon from '@element-plus/icons-vue'
import { svgIcons } from '@assets/svg-icons/index'
// TODO  通过 svg-icon 组件统一显示icon
// import * as IconPark from "@icon-park/vue-next"

type ElIconName = keyof typeof ElIcon

type SvgIconName = (typeof svgIcons)[number]

defineOptions({
  name: 'svg-icon'
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String as PropType<SvgIconName | ElIconName>,
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
  return isExternal
})

const symbolId = computed(
  () => `#${props.prefix}-${props.name}`
)
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  overflow: hidden;
  fill: currentColor;
}
</style>
