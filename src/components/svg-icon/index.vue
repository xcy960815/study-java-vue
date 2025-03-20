<template>
  <div v-if="svgContent" v-html="svgContent" :style="{ width: `${size}px`, height: `${size}px`, fill }"class="svg-icon" />
</template>
<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
// 本地icon
import { svgIcons } from '@assets/svg-icons'
type SvgIconNames = keyof typeof svgIcons
const props = defineProps({
  type: {
    type: String as PropType<SvgIconNames>,
    default: ''
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 24, 
  },
  fill: {
    type: String as PropType<string>,
    default: 'currentColor', // 默认继承文本颜色
  }
});

const svgContent = ref('');

/**
 * 加载本地 SVG
 */
const loadSvg = async () => {

  if (!props.type) return;

  try {
    const response = await fetch(`src/assets/svg-icons/${props.type}.svg`); // 确保路径正确
    svgContent.value = await response.text();
    console.log(" svgContent.value", svgContent.value);
  } catch (error) {
    console.error(`加载 SVG 失败: ${props.type}`, error);
    svgContent.value = ''; // 遇到错误时清空
  }
};

// 监听 name 变化，动态更新
watch(() => props.type, loadSvg, { immediate: true });

// onMounted(loadSvg);
</script>

<style scoped>
.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: inherit;
  /* 让 fill 继承外部样式 */
}
</style>
