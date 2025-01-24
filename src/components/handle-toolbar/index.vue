<template>
  <el-row class="handle-toolbar" :gutter="10">
    <el-col
      :span="1.5"
      v-for="(slotContent, index) in defaultSlotContents"
      :key="index"
    >
      <component :is="slotContent" />
    </el-col>
    <el-col :span="1.5" class="right-panel">
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button
          size="small"
          circle
          :icon="Search"
          @click="toggleSearch()"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="刷新"
        placement="top"
      >
        <el-button
          size="small"
          circle
          :icon="Refresh"
          @click="refresh()"
        />
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import { useSlots, type Slots } from 'vue'

defineOptions({
  name: 'handle-toolbar'
})
const showSearch = defineModel('showSearch', {
  default: true
})
const emits = defineEmits(['queryTableData'])
/**
 * 刷新
 */
const refresh = () => {
  emits('queryTableData')
}
/**
 * 点击搜索按钮
 */
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const slots: Slots = useSlots()
const defaultSlotContents = slots.default
  ? slots.default()
  : []
</script>
<style lang="less" scoped>
.handle-toolbar {
  position: relative;
  margin-bottom: 10px;
  height: 32px;

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
