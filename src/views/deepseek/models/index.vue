<template>
  <div class="deepseek-models-container">
    <Handle-ToolBar @queryTableData="handleGetBalance">
      <el-button size="small" type="primary" @click="handleGetBalance">获取余额</el-button>
    </Handle-ToolBar>
    <el-table
      border
      :data="deepseekModelsListInfo.tableData"
      style="width: 100%"
      v-loading="loadingModel"
    >
      <el-table-column prop="id" label="模型名称" />
      <el-table-column prop="object" label="类型" />
      <el-table-column prop="owned_by" label="来源" />
      <el-table-column prop="created" label="注册时间">
        <template #default="{ row }">
          {{ row.created == 0 ? '未知' : row.created }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleStartChat(row)"
            >开始对话</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemInfoStore } from '@store'
import { deepseekModule } from '@apis'
import { ElMessage } from 'element-plus'
const systemInfoStore = useSystemInfoStore()
const router = useRouter()
interface DeepseekModelsListInfo {
  tableData: DeepSeekVo.ModelOption[]
}
const deepseekModelsListInfo = reactive<DeepseekModelsListInfo>({
  tableData: [],
})
const loadingModel = ref<boolean>(false)
/**
 * 开始对话
 */
const handleStartChat = (row: DeepSeekVo.ModelOption) => {
  router.push({
    path: '/deepseek/chat',
    query: row ? { model: row.id } : {},
  })
  setTimeout(() => {
    systemInfoStore.addHistoryItem
  })
}

/**
 * 获取当前key对相应的模型
 */
const handleGetModels = async () => {
  loadingModel.value = true
  const result = await deepseekModule.getModels<DeepSeekVo.Models>()
  if (result.code === 200) {
    deepseekModelsListInfo.tableData = result.data.data
  }
  loadingModel.value = false
}

/**
 * 获取当前api-key对应的余额
 */
const handleGetBalance = async () => {
  const result = await deepseekModule.getBalance<DeepSeekVo.Balance>()
  if (result.code === 200) {
    const totalBalance = result.data.balance_infos[0].total_balance
    ElMessage({
      type: 'success',
      message: `当前余额：${totalBalance}`,
    })
  }
}

onMounted(() => {
  handleGetModels()
})
</script>
<style lang="less" scoped>
.deepseek-models-container {
  padding: 16px;
  background-color: var(--el-bg-color);
  min-height: 100%;
  border-radius: 4px;
}
</style>
