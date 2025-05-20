<template>
  <el-tree-select
    class="file-tree-select"
    :model-value="modelValue"
    :data="fileStructureData"
    :props="defaultProps"
    :render-after-expand="false"
    filterable
    clearable
    placeholder="搜索文件..."
    style="width: 100%"
    @update:model-value="handleChange"
  >
    <template #default="{ node, data }">
      <div class="custom-tree-node">
        <span class="node-label">{{ data.value }}</span>
        <span class="node-actions">
          <el-button type="text" size="small" @click.stop="copyPath(data.value)" title="复制路径">
            <el-icon><CopyDocument /></el-icon>
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.stop="createChildMenu(data)"
            title="创建子菜单"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
        </span>
      </div>
    </template>
  </el-tree-select>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CopyDocument, Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'FileTree',
})

// 定义 props 和 emits
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileStructureData = ref<FileTree.FileNode[]>([])

// 配置树形选择器的属性
const defaultProps = {
  children: 'children',
  label: 'value', // 使用 path 作为显示标签
  value: 'value', // 使用 path 作为选择值
}

// 获取项目文件结构
const fetchFileStructure = async () => {
  // 在开发环境中使用API获取文件结构
  if (import.meta.env.DEV) {
    const response = await fetch('/api/project/file-structure')
    if (response.ok) {
      const result = await response.json()
      if (result.code === 200 && result.data) {
        fileStructureData.value = result.data
        console.log('fileStructureData', fileStructureData.value)
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

// 处理选择变化
const handleChange = (value: string) => {
  emit('update:modelValue', value)
  console.log('Selected path:', value)
}

// 复制路径功能
const copyPath = async (path: string) => {
  try {
    await navigator.clipboard.writeText(path)
    ElMessage.success('路径已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 创建子菜单功能
const createChildMenu = (node: any) => {
  ElMessageBox.prompt('请输入新子菜单名称', '创建子菜单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^.+$/, // 非空
    inputErrorMessage: '名称不能为空',
  })
    .then(({ value }) => {
      if (!node.children) node.children = []
      // 生成新子菜单路径
      const newPath = node.value.endsWith('/') ? node.value + value : node.value + '/' + value
      node.children.push({
        value: newPath,
        label: value,
        children: [],
      })
      ElMessage.success('子菜单创建成功')
    })
    .catch(() => {})
}

onMounted(() => {
  fetchFileStructure()
})
</script>

<style lang="scss" scoped>
.file-tree-select {
  width: 100%;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  justify-content: space-between;
}

.node-label {
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-tree-select__popper) {
  .el-tree {
    max-height: 300px;
  }
}
</style>
