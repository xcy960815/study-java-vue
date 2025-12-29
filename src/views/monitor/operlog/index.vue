<template>
  <div class="h-full w-full relative p-4">
    <el-form
      :model="queryFormData"
      ref="queryFormRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryFormData.title"
          placeholder="请输入系统模块"
          clearable
          class="!w-60"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryFormData.operName"
          placeholder="请输入操作人员"
          clearable
          class="!w-60"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryFormData.businessType"
          placeholder="操作类型"
          clearable
          class="!w-60"
        >
          <el-option
            v-for="item in businessTypeOptions"
            :key="item.id"
            :label="item.dictName"
            :value="Number(item.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryFormData.status" placeholder="操作状态" clearable class="!w-60">
          <el-option label="正常" :value="0" />
          <el-option label="异常" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb-2">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="multiple"
          @click="handleDeleteBatch()"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain :icon="Delete" @click="handleCleanAll">清空</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tableInfo.tableData" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志编号" align="center" prop="operId" />
      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" prop="businessType">
        <template #default="scope">
          <el-tag v-if="scope.row.businessType === 1">新增</el-tag>
          <el-tag v-else-if="scope.row.businessType === 2" type="warning">修改</el-tag>
          <el-tag v-else-if="scope.row.businessType === 3" type="danger">删除</el-tag>
          <el-tag v-else>{{ formatBusinessType(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" align="center" prop="operName">
        <template #default="scope">
          <div class="operator-info">
            <el-icon class="operator-icon"><User /></el-icon>
            <span>{{ formatOperName(scope.row.operName) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="主机"
        align="center"
        prop="operIp"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作状态" align="center" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作日期" align="center" prop="operTime" width="180">
        <template #default="scope">
          <span>{{ formatTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗时间" align="center" prop="costTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" :icon="View" @click="openDetailDialog(scope.row)"
            >详细</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end mt-5">
      <el-pagination
        v-show="tableInfo.total > 0"
        v-model:current-page="tableInfo.pageNum"
        v-model:page-size="tableInfo.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableInfo.total"
        @size-change="fetchOperLogList"
        @current-change="fetchOperLogList"
      />
    </div>

    <!-- 操作日志详细 -->
    <el-dialog
      title="操作日志详细"
      v-model="detailVisible"
      width="900px"
      append-to-body
      class="operlog-detail-dialog"
    >
      <div class="detail-container">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title">
            <el-icon><InfoFilled /></el-icon>
            <span>基本信息</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">操作模块</span>
              <span class="value">{{ operLogDetail.title }}</span>
            </div>
            <div class="info-item">
              <span class="label">操作类型</span>
              <el-tag size="small">{{ formatBusinessType(operLogDetail) }}</el-tag>
            </div>
            <div class="info-item">
              <span class="label">操作状态</span>
              <el-tag v-if="operLogDetail.status === 0" type="success" size="small">正常</el-tag>
              <el-tag v-else type="danger" size="small">失败</el-tag>
            </div>
            <div class="info-item">
              <span class="label">消耗时间</span>
              <span class="value">{{ operLogDetail.costTime }} 毫秒</span>
            </div>
          </div>
        </div>

        <!-- 请求信息 -->
        <div class="detail-section">
          <div class="section-title">
            <el-icon><Link /></el-icon>
            <span>请求信息</span>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="label">请求地址</span>
              <span class="value code">{{ operLogDetail.operUrl }}</span>
            </div>
            <div class="info-item">
              <span class="label">请求方式</span>
              <el-tag size="small" :type="getMethodType(operLogDetail.requestMethod)">{{
                operLogDetail.requestMethod
              }}</el-tag>
            </div>
            <div class="info-item full-width">
              <span class="label">操作方法</span>
              <span class="value code">{{ operLogDetail.method }}</span>
            </div>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="detail-section">
          <div class="section-title">
            <el-icon><User /></el-icon>
            <span>用户信息</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">操作人员</span>
              <span class="value">{{ formatOperName(operLogDetail.operName) }}</span>
            </div>
            <div class="info-item">
              <span class="label">主机地址</span>
              <span class="value code">{{ operLogDetail.operIp }}</span>
            </div>
          </div>
        </div>

        <!-- 请求参数 -->
        <div class="detail-section">
          <div class="section-title">
            <el-icon><DocumentCopy /></el-icon>
            <span>请求参数</span>
          </div>
          <div class="json-box">
            <div
              v-if="operLogDetail.operParam"
              class="json-content"
              v-html="formatJsonWithSyntax(operLogDetail.operParam)"
            ></div>
            <span v-else class="empty-text">无</span>
          </div>
        </div>

        <!-- 返回参数 -->
        <div class="detail-section">
          <div class="section-title">
            <el-icon><Finished /></el-icon>
            <span>返回参数</span>
          </div>
          <div class="json-box">
            <div
              v-if="operLogDetail.jsonResult"
              class="json-content"
              v-html="formatJsonWithSyntax(operLogDetail.jsonResult)"
            ></div>
            <span v-else class="empty-text">无</span>
          </div>
        </div>

        <!-- 异常信息 -->
        <div class="detail-section" v-if="operLogDetail.status === 1 && operLogDetail.errorMsg">
          <div class="section-title error">
            <el-icon><Warning /></el-icon>
            <span>异常信息</span>
          </div>
          <div class="error-box">
            {{ operLogDetail.errorMsg }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Operlog" lang="ts">
import { getOperLogList, deleteOperLog, cleanOperLog } from '@/apis/monitor/operlog'
import { getDataDictList } from '@/apis/system/dataDict'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import {
  Search,
  Refresh,
  Delete,
  View,
  User,
  InfoFilled,
  Link,
  DocumentCopy,
  Finished,
  Warning,
} from '@element-plus/icons-vue'

const loading = ref(true)
const selectedIds = ref<number[]>([])
const multiple = ref(true)
const showSearch = ref(true)
const operLogDetail = ref<OperLogVo>({} as OperLogVo)
const detailVisible = ref(false)
const queryFormRef = ref<FormInstance>()
const businessTypeOptions = ref<DataDictionaryVo[]>([])

interface TableInfo {
  tableData: OperLogVo[]
  total: number
  pageSize: number
  pageNum: number
}

const queryFormData = reactive<OperLogDto>({
  title: undefined,
  operName: undefined,
  businessType: undefined,
  status: undefined,
})

const tableInfo = reactive<TableInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

const fetchOperLogList = async () => {
  loading.value = true
  try {
    const res = await getOperLogList({
      ...queryFormData,
      pageNum: tableInfo.pageNum,
      pageSize: tableInfo.pageSize,
    })
    tableInfo.tableData = res.data
    tableInfo.total = res.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatBusinessType = (row: OperLogVo) => {
  // 简单映射，实际可以使用字典
  const types = [
    '其它',
    '新增',
    '修改',
    '删除',
    '授权',
    '导出',
    '导入',
    '强退',
    '生成代码',
    '清空数据',
    '查询',
  ]
  return types[row.businessType] || row.businessType
}

const handleSearch = async () => {
  tableInfo.pageNum = 1
  await fetchOperLogList()
}

const handleReset = async () => {
  Object.assign(queryFormData, {
    title: undefined,
    operName: undefined,
    businessType: undefined,
    status: undefined,
  })
  tableInfo.pageNum = 1
  tableInfo.pageSize = 10
  await fetchOperLogList()
}

const onSelectionChange = (selection: OperLogVo[]) => {
  selectedIds.value = selection.map((item) => item.operId)
  multiple.value = !selection.length
}

const openDetailDialog = (row: OperLogVo) => {
  detailVisible.value = true
  operLogDetail.value = row
}

const handleDeleteBatch = async (row?: OperLogVo) => {
  const operIds = row?.operId ? [row.operId] : selectedIds.value
  try {
    await ElMessageBox.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteOperLog(operIds)
    ElMessage.success('删除成功')
    await fetchOperLogList()
  } catch (error) {
    // cancel
  }
}

const handleCleanAll = async () => {
  try {
    await ElMessageBox.confirm('是否确认清空所有操作日志数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await cleanOperLog()
    ElMessage.success('清空成功')
    await fetchOperLogList()
  } catch (error) {
    // cancel
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatJson = (json: string) => {
  if (!json) return ''
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch (e) {
    return json
  }
}

const formatOperName = (operName: string) => {
  if (!operName) return '-'
  try {
    const data = JSON.parse(operName)
    return data.loginName || data.userName || operName
  } catch (e) {
    return operName
  }
}

const getMethodType = (method: string) => {
  const methodMap: Record<string, any> = {
    GET: 'success',
    POST: 'primary',
    PUT: 'warning',
    DELETE: 'danger',
  }
  return methodMap[method?.toUpperCase()] || 'info'
}

const formatJsonWithSyntax = (json: string) => {
  if (!json) return ''
  try {
    const formatted = JSON.stringify(JSON.parse(json), null, 2)
    return formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // 键
      .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>') // 字符串值
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>') // 布尔值
      .replace(/: (null)/g, ': <span class="json-null">$1</span>') // null
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>') // 数字
  } catch (e) {
    return json
  }
}

/**
 * 获取业务类型字典
 */
const fetchBusinessTypeDict = async () => {
  try {
    const res = await getDataDictList({
      dictType: 'sys_oper_type',
      status: 1,
      pageNum: 1,
      pageSize: 100,
    })
    businessTypeOptions.value = res.data
  } catch (error) {
    console.error('获取业务类型字典失败:', error)
  }
}

onMounted(() => {
  fetchBusinessTypeDict()
  fetchOperLogList()
})
</script>

<style scoped lang="less">
.code-box {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;

  pre {
    margin: 0;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.operator-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  .operator-icon {
    color: #409eff;
    font-size: 16px;
  }
}

.operlog-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e4e7ed;

    .el-icon {
      color: #409eff;
      font-size: 18px;
    }

    &.error {
      color: #f56c6c;

      .el-icon {
        color: #f56c6c;
      }
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e8eaed;
    transition: all 0.2s;

    &:hover {
      border-color: #d0d7de;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    &.full-width {
      grid-column: 1 / -1;
    }

    .label {
      flex-shrink: 0;
      min-width: 80px;
      font-size: 13px;
      color: #57606a;
      font-weight: 600;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 14px;
        background: #409eff;
        border-radius: 2px;
      }
    }

    .value {
      flex: 1;
      font-size: 14px;
      color: #24292f;
      word-break: break-all;

      &.code {
        background: #f6f8fa;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        border: 1px solid #d0d7de;
        color: #1f2328;
      }
    }
  }
}

.json-box {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
  max-height: 250px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;

  pre {
    margin: 0;
    color: #2c3e50;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .json-content {
    white-space: pre-wrap;
    word-break: break-all;
    color: #2c3e50;
  }

  .json-key {
    color: #e96900;
    font-weight: 600;
  }

  .json-string {
    color: #22863a;
  }

  .json-number {
    color: #005cc5;
    font-weight: 600;
  }

  .json-boolean {
    color: #d73a49;
    font-weight: 600;
  }

  .json-null {
    color: #6f42c1;
    font-weight: 600;
  }

  .empty-text {
    color: #909399;
    font-style: italic;
  }
}

.error-box {
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 6px;
  padding: 12px;
  color: #f56c6c;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
}
</style>
