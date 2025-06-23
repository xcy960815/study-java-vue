<template>
  <div class="data-dictionary-container h-full w-full relative">
    <el-form class="search-form" :model="dataDictionaryQueryParams" ref="dataDictionaryQueryFormRef" inline>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="dataDictionaryQueryParams.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="dataDictionaryQueryParams.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataDictionaryQueryParams.status" placeholder="请选择状态" style="width: 200px" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="handleGetDataDictionaryList">
      <el-button size="small" type="primary" @click="handleAddDictionary">新增字典</el-button>
    </Handle-ToolBar>
    <el-table border class="data-dictionary-table" v-loading="dataDictionaryListInfo.loading"
      :data="dataDictionaryListInfo.tableData">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="dictType" label="字典类型" />
      <el-table-column prop="dictCode" label="字典编码" />
      <el-table-column prop="dictName" label="字典名称" />
      <el-table-column prop="dictValue" label="字典值" />
      <el-table-column prop="sortOrder" label="排序号" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleUpdateDictionary(scope.row)">修改</el-button>
          <el-button type="primary" link @click="handleDeleteDictionary(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="dataDictionaryQueryParams.pageNum"
      v-model:page-size="dataDictionaryQueryParams.pageSize" :total="dataDictionaryListInfo.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 添加或修改字典对话框 -->
    <el-dialog class="system-data-dictionary-dialog" :title="dataDictionaryDialogTitle"
      v-model="dataDictionaryDialogVisible" width="500px" append-to-body>
      <el-form ref="dataDictionaryFormRef" :model="dataDictionaryFormData" :rules="dataDictionaryFormRules"
        label-width="80px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="dataDictionaryFormData.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="dataDictionaryFormData.dictCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="dataDictionaryFormData.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="dataDictionaryFormData.dictValue" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="排序号" prop="sortOrder">
          <el-input-number v-model="dataDictionaryFormData.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataDictionaryFormData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataDictionaryFormData.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
          <el-button @click="dataDictionaryDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getDataDictionaryList,
  addDataDictionary,
  updateDataDictionary,
  deleteDataDictionary,
} from '@/apis/system/dictionary'
import HandleToolBar from '@/components/handle-toolbar/index.vue'

interface DataDictionaryListInfo {
  tableData: DataDictionaryVo[]
  loading: boolean
  total: number
}

const dataDictionaryListInfo = reactive<DataDictionaryListInfo>({
  tableData: [],
  loading: false,
  total: 0,
})

const dataDictionaryQueryParams = reactive<Partial<DataDictionaryDto> & BaseListDto>({
  pageNum: 1,
  pageSize: 10,
  dictType: '',
  dictName: '',
  status: 1,
})

const dataDictionaryFormData = reactive<DataDictionaryDto>({
  dictType: '',
  dictCode: '',
  dictName: '',
  dictValue: '',
  sortOrder: 0,
  status: 1,
})

const dataDictionaryFormRules: FormRules<DataDictionaryDto> = {
  dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  dictCode: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }],
  dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
}

const dataDictionaryQueryFormRef = ref<FormInstance>()

const dataDictionaryFormRef = ref<FormInstance>()

const dataDictionaryDialogTitle = ref('')
const dataDictionaryDialogVisible = ref(false)

/**
 * @description 获取数据字典列表
 */
const handleGetDataDictionaryList = async () => {
  dataDictionaryListInfo.loading = true
  const res = await getDataDictionaryList(dataDictionaryQueryParams).finally(() => {
    dataDictionaryListInfo.loading = false
  })
  if (res.code === 200) {
    dataDictionaryListInfo.tableData = res.data.data
    dataDictionaryListInfo.total = res.data.total
  }
}

// 搜索按钮操作
const handleQuery = () => {
  dataDictionaryQueryParams.pageNum = 1
  dataDictionaryQueryParams.pageSize = 10
  handleGetDataDictionaryList()
}

// 重置按钮操作
const resetQuery = () => {
  dataDictionaryQueryFormRef.value?.resetFields()
  handleQuery()
}

/**
 * @description 新增字典
 */
const handleAddDictionary = () => {
  dataDictionaryDialogVisible.value = true
  dataDictionaryDialogTitle.value = '添加字典'
  nextTick(() => {
    dataDictionaryFormRef.value?.resetFields()
  })
}

/**
 * @description 修改字典
 */
const handleUpdateDictionary = (row: DataDictionaryVo) => {
  dataDictionaryDialogVisible.value = true
  dataDictionaryDialogTitle.value = '修改字典'
  nextTick(() => {
    dataDictionaryFormRef.value?.resetFields()
    Object.assign(dataDictionaryFormData, row)
  })
}

/**
 * @description 提交按钮
 */
const handleConfirm = async () => {
  const valid = await dataDictionaryFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (dataDictionaryFormData?.id) {
    await updateDataDictionary(dataDictionaryFormData)
  } else {
    await addDataDictionary(dataDictionaryFormData)
  }
  ElMessage.success('操作成功')
  dataDictionaryDialogVisible.value = false
  handleGetDataDictionaryList()
}

/**
 * @description 删除字典
 */
const handleDeleteDictionary = (row: DataDictionaryVo) => {
  ElMessageBox.confirm('确认要删除该字典吗？', '警告', {
    type: 'warning',
  }).then(async () => {
    const result = await deleteDataDictionary(row.id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      handleGetDataDictionaryList()
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  dataDictionaryQueryParams.pageSize = val
  dataDictionaryQueryParams.pageNum = 1
  handleGetDataDictionaryList()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  dataDictionaryQueryParams.pageNum = val
  handleGetDataDictionaryList()
}

const showSearch = ref(false)

onMounted(() => {
  handleGetDataDictionaryList()
})
</script>

<style lang="less" scoped>
.data-dictionary-container {
  position: relative;
  padding: 16px;
  background-color: var(--el-bg-color);
  min-height: 100%;
  border-radius: 4px;

  .search-form {
    background-color: var(--el-bg-color-overlay);
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    border: 1px solid var(--el-border-color-light);

    :deep(.el-form-item) {
      margin-bottom: 16px;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }

      .el-form-item__label {
        color: var(--el-text-color-primary);
      }

      .el-input__wrapper {
        background-color: var(--el-bg-color);
      }
    }
  }

  .data-dictionary-table {
    margin-bottom: 16px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;
    overflow: hidden;

    :deep(.el-table__header) {
      background-color: var(--el-bg-color-overlay);

      th {
        background-color: var(--el-bg-color-overlay);
        color: var(--el-text-color-primary);
        font-weight: 600;
      }
    }

    :deep(.el-table__body) {
      td {
        background-color: var(--el-bg-color-overlay);
        color: var(--el-text-color-regular);
      }
    }

    :deep(.el-table--border) {
      border-color: var(--el-border-color-light);
    }

    :deep(.el-table__cell) {
      border-color: var(--el-border-color-light);
    }
  }
}

.system-data-dictionary-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 16px 20px;
    margin: 0;

    .el-dialog__title {
      color: var(--el-text-color-primary);
      font-weight: 600;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--el-border-color-light);
    padding: 16px 20px;
  }

  :deep(.el-form-item__label) {
    color: var(--el-text-color-primary);
  }

  :deep(.el-input__wrapper) {
    background-color: var(--el-bg-color);
  }
}
</style>
