<template>
  <div class="deepseek-models">
    <Handle-ToolBar
      v-model:showSearch="showSearch"
      @queryTableData="getOllamaModelsList"
    >
      <el-button type="primary" @click="handleStartChat()"
        >开始对话</el-button
      >
    </Handle-ToolBar>
    <el-table
      border
      :data="deepseekModelsListInfo.tableData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="模型名称" />
      <el-table-column prop="object" label="类型" />
      <el-table-column prop="owned_by" label="来源" />
      <el-table-column prop="created" label="注册时间" />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleStartChat(row)"
            >开始对话</el-button
          >
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
    <!-- 查看正在内存运行的模型 -->
    <el-dialog
      v-model="psDialogVisible"
      title="正在内存运行的模型"
    >
      <el-table
        border
        :data="psModelsList"
        style="width: 100%"
      >
        <el-table-column prop="name" label="模型名称" />
        <el-table-column prop="object" label="类型" />
        <el-table-column prop="owned_by" label="来源" />
        <el-table-column prop="expires_at" label="销毁时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleStartChat(row)"
              >开始对话</el-button
            >
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
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="psDialogVisible = false"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { deepseekModule } from '@apis'
import { useRouter } from 'vue-router'
const router = useRouter()
const showSearch = ref(false)
const psDialogVisible = ref(false)

interface DeepseekModelsListInfo {
  tableData: DeepSeekDto.ModelOption[]
}
const deepseekModelsListInfo =
  reactive<DeepseekModelsListInfo>({
    tableData: []
  })
const psModelsList = ref([])
const getOllamaModelsList = () => {
  console.log('getOllamaModelsList')
}
const handleStartChat = (row?: DeepSeekDto.ModelOption) => {
  console.log('handleStartChat')
  router.push({
    path: '/deepseek/chat',
    query: row ? { model: row.id } : {}
  })
}

const handleClickDeleteModel = (
  row?: DeepSeekDto.ModelOption
) => {
  console.log('handleClickDeleteModel')
}
const version = () => {
  console.log('version')
}

/**
 * 获取当前key对相应的模型
 */
const handleGetModels = async () => {
  const result = await deepseekModule.models()
  console.log('result', result)
  if (result.code === 200) {
    deepseekModelsListInfo.tableData = result.data.data
  }
}
onMounted(() => {
  handleGetModels()
})
</script>
<style lang="less" scoped></style>
