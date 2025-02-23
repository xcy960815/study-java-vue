<template>
  <!-- 本地ollama列表 -->
  <Handle-ToolBar
    v-model:showSearch="showSearch"
    @queryTableData="getOllamaModelsList"
  ></Handle-ToolBar>
  <el-table
    border
    :data="ollamaModelsListInfo.tableData"
    style="width: 100%"
  >
    <el-table-column prop="id" label="模型名称" />
    <el-table-column prop="object" label="类型" />
    <el-table-column prop="owned_by" label="来源" />
    <el-table-column prop="created" label="注册时间" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button
          link
          type="primary"
          size="small"
          @click="handleClickDeleteModel(row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ollamaModule } from '@apis'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'

const ollamaModelsListInfo = reactive<{
  tableData: Array<OllamaDto.ModelOption>
}>({
  tableData: []
})

/**
 * 获取ollama模型
 */
const getOllamaModelsList = async () => {
  const result = await ollamaModule.models()
  if (result.code === 200) {
    ollamaModelsListInfo.tableData = result.data.data
  }
}

/**
 * 删除模型
 * @param row {OllamaDto.ModelOption}
 */
const handleClickDeleteModel = (
  row: OllamaDto.ModelOption
) => {
  ElMessageBox.confirm(
    `确认要删除模型【${row.id}】吗?`,
    '警告⚠️',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const result =
        await ollamaModule.deleteModel<boolean>({
          name: row.id
        })
      if (result.code !== 200) return
      getOllamaModelsList()
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}

const showSearch = ref(true)

onMounted(() => {
  getOllamaModelsList()
})
</script>
