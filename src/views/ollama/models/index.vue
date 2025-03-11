<template>
  <!-- 本地ollama列表 -->
  <Handle-ToolBar
    v-model:showSearch="showSearch"
    @queryTableData="getOllamaModelsList"
  >
    <el-button type="primary" size="small" @click="handleStartChat()"
      >开始对话</el-button
    >
    <el-button size="small" @click="version"
      >查看本地ollama版本</el-button
    >
    <el-button size="small" @click="ps">查看正在运行的模型</el-button>
  </Handle-ToolBar>
  <el-table
    border
    :data="ollamaModelsListInfo.tableData"
    style="width: 100%"
  >
    <el-table-column prop="id" label="模型名称" />
    <el-table-column prop="object" label="类型" />
    <el-table-column prop="owned_by" label="来源" />
    <el-table-column prop="created" label="注册时间" />
    <el-table-column fixed="right" label="操作" width="150">
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
        <!-- <template #default="scope">
          <span>{{ dayjs(scope.row.expires_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template> -->
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
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { ollamaModule } from '@apis'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
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
 * 开始对话
 * @param row {OllamaDto.ModelOption}
 */
const handleStartChat = (row?: OllamaDto.ModelOption) => {
  router.push({
    path: '/ollama/chat',
    query: row ? { model: row.id } : {}
  })
}

/**
 * 查看ollama版本
 */
const version = async () => {
  const result = await ollamaModule.version()
  if (result.code === 200) {
    ElMessage(`当前ollama版本是${result.data.version}`)
  }
}

const psDialogVisible = ref(false)
const psModelsList = ref<Array<OllamaDto.PsModelOption>>([])

/**
 * 查看正在内存运行的模型
 */
const ps = async () => {
  const result = await ollamaModule.ps()
  if (result.code === 200) {
    psDialogVisible.value = true
    console.log('result.data.models', result.data.models)

    psModelsList.value = result.data.models.map((item) => {
      return {
        ...item,
        expires_at: item.expires_at
          ? dayjs(item.expires_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : ''
      }
    })
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
    .catch((error) => {
      console.log('error', error)

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
