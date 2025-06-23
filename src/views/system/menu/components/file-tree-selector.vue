<template>
  <el-tree-select
    class="file-tree-select"
    v-model="localModelValue"
    :data="fileStructureData"
    :props="defaultProps"
    :render-after-expand="false"
    filterable
    clearable
    :placeholder="placeholder"
    style="width: 100%"
  >
  </el-tree-select>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

defineOptions({
  name: 'FileTreeSelector',
})

// 定义 props 和 emits
const props = defineProps({
  placeholder: {
    type: String,
    default: () => '',
  },
  modelValue: {
    type: String,
    default: () => '',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileStructureData = ref<FileTree.FileNode[]>([])

/**
 * 树形选择器的属性
 */
const defaultProps = {
  children: 'children',
  label: 'value', // 使用 path 作为显示标签
  value: 'value', // 使用 path 作为选择值
}

/**
 * 获取项目文件结构
 */
const fetchFileStructure = async () => {
  // 在开发环境中使用API获取文件结构
  if (import.meta.env.DEV) {
    const response = await fetch('/api/project/file-structure')
    if (response.ok) {
      const result = await response.json()
      if (result.code === 200 && result.data) {
        fileStructureData.value = result.data
        console.log('fileStructureData.value', fileStructureData.value)
      }
    }
  } else {
    // 在生产环境中从public目录加载文件结构数据
    const response = await fetch('/file-structure.json')
    if (response.ok) {
      const data = await response.json()
      fileStructureData.value = data
    }
  }
}

const localModelValue = computed({
  get() {
    console.log('localModelValue', props.modelValue)
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

onMounted(() => {
  fetchFileStructure()
})
</script>

<style lang="scss" scoped>
.file-tree-select {
  width: 100%;
}

:deep(.el-tree-select__popper) {
  .el-tree {
    max-height: 300px;
  }
}
</style>
