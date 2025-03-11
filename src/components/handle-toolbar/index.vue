<template>
  <el-row  class="handle-toolbar" :gutter="20">
    <el-col
      v-for="(slotContent, index) in defaultSlotContents"
      :key="index"
      :span="columnSpans[index] || 2" 
    >
      <component class="el-col-item" :is="slotContent" />
    </el-col>
    <el-col :span="2" class="right-panel">
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="small" circle :icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="small" circle :icon="Refresh" @click="refresh()" />
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import { useSlots, ref, onMounted, nextTick } from 'vue'

defineOptions({
  name: 'handle-toolbar'
})
const showSearch = defineModel('showSearch', {
  default: true
})
const emits = defineEmits(['queryTableData'])

const refresh = () => {
  emits('queryTableData')
}
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const slots = useSlots()

const defaultSlotContents = slots.default ? slots.default() : []

// 存储计算后的 span 值
const columnSpans = ref<number[]>([])

/**
 * 计算 span 方法 todo
 */
const calculateSpans = () => {
  nextTick(() => {
    const parentWidth = document.querySelector<HTMLDivElement>(".handle-toolbar")?.offsetWidth!
    const elColItems = document.querySelectorAll<HTMLDivElement>(".el-col-item")
    columnSpans.value = Array.from(elColItems).map(el => {
      const width = el?.offsetWidth
      return (width / parentWidth) * 24
    })
  })
}

// 组件加载后计算
onMounted(() => {
  calculateSpans()
  window.addEventListener('resize', calculateSpans)
})
</script>

<style lang="less" scoped>
.handle-toolbar {
  position: relative;
  margin-bottom: 10px;
  min-height: 26px;

  .right-panel {
    display: flex;
    align-items: center;
  }

  .el-col:last-child {
    position: absolute;
    right: 0;
  }
}
</style>
