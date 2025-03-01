<template>
  <div class="deepseek-models">
    <Handle-ToolBar
      v-model:showSearch="showSearch"
      @queryTableData="getOllamaModelsList"
    >
      <el-button type="primary" @click="handleStartChat()"
        >开始对话</el-button
      >
      <el-button @click="version"
        >查看本地ollama版本</el-button
      >
      <el-button @click="ps">查看正在运行的模型</el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const showSearch = ref(false)
const psDialogVisible = ref(false)
const ollamaModelsListInfo = reactive({
  tableData: []
})
const psModelsList = ref([])
const getOllamaModelsList = () => {
  console.log('getOllamaModelsList')
}
const handleStartChat = () => {
  console.log('handleStartChat')
}
const handleClickDeleteModel = () => {
  console.log('handleClickDeleteModel')
}
const version = () => {
  console.log('version')
}
const ps = () => {
  console.log('ps')
}
</script>
<style lang="less" scoped></style>
