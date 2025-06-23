<template>
  <div class="role-list-container">
    <el-form
      :model="queryFormData"
      label-width="auto"
      inline
      v-show="showSearch"
      class="search-form"
    >
      <el-form-item label="角色名称">
        <el-input v-model="queryFormData.roleName" placeholder="角色名称" @change="getRoleList" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="queryFormData.roleCode" placeholder="角色编码" @change="getRoleList" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryFormData.status"
          placeholder="请选择状态"
          @change="getRoleList"
          style="width: 200px"
          clearable
        >
          <el-option label="正常" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
      </el-form-item>
    </el-form>

    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getRoleList">
      <el-button size="small" type="primary" @click="handleClickAddRole"> 新增角色 </el-button>
    </Handle-ToolBar>

    <el-table border :data="roleListInfo.tableData" style="width: 100%" class="role-table">
      <el-table-column prop="roleName" label="角色名称" width="150" />
      <el-table-column prop="roleCode" label="角色编码" width="150" />
      <el-table-column prop="roleSort" label="显示顺序" width="100" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建时间" width="260" />
      <el-table-column fixed="right" label="操作" min-width="150">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditRole(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteRole(row)"
            >删除</el-button
          >
          <el-button
            v-if="row.status === 1"
            link
            type="danger"
            size="small"
            @click="handleClickDisableRole(row)"
            >禁用</el-button
          >
          <el-button
            v-if="row.status === 0"
            link
            type="primary"
            size="small"
            @click="handleClickEnableRole(row)"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="roleListInfo.pageNum"
      v-model:page-size="roleListInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="roleListInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
      class="pagination"
    />

    <el-dialog
      v-model="addOrEditRoleDialogVisible"
      :title="addOrEditRoleDialogTitle"
      class="system-role-dialog"
      width="500px"
    >
      <el-form
        ref="addOrEditRoleFormRef"
        :model="addOrEditRoleFormData"
        :rules="addOrEditRoleFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addOrEditRoleFormData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="addOrEditRoleFormData.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="addOrEditRoleFormData.roleSort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addOrEditRoleFormData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单权限 -->
        <el-form-item label="菜单权限" prop="menuIds">
          <el-tree-select
            show-checkbox
            v-model="addOrEditRoleFormData.menuIds"
            :data="menuTreeData"
            :props="{ label: 'menuName', children: 'children' }"
            placeholder="请选择菜单权限"
            check-strictly
            multiple
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addOrEditRoleFormData.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { roleModule } from '@apis'
import { onMounted, reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getAllMenuTree } from '@/apis/system/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { useAsyncComputed } from '@/composables/useAsyncComputed'
import { useFilterMenuTree } from '@/composables/useFilterMenuTree'
defineOptions({
  name: 'roleList',
})

interface RoleListInfo {
  tableData: RoleInfoVo[]
  total: number | undefined
  pageSize: number
  pageNum: number
}

const queryFormData = reactive({
  roleName: '',
  roleCode: '',
  status: undefined as number | undefined,
})

/**
 * @description 菜单树数据
 */
const menuTreeData = useAsyncComputed(async () => {
  const result = await getAllMenuTree()

  const menuTree = useFilterMenuTree(result.data)
  return menuTree
})

const addOrEditRoleDialogTitle = ref('')

const addOrEditRoleDialogVisible = ref(false)

const roleListInfo = reactive<RoleListInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

/**
 * 获取角色列表
 */
const getRoleList = async () => {
  const pageSize = roleListInfo.pageSize
  const pageNum = roleListInfo.pageNum
  const result = await roleModule.getRoleList({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    roleListInfo.tableData = result.data.data
    roleListInfo.total = result.data.total
  }
}

const addOrEditRoleFormRef = ref<FormInstance>()

const addOrEditRoleFormData = reactive<RoleInfoDto>({
  roleName: '',
  roleCode: '',
  roleSort: 0,
  status: 1,
  remark: '',
})

const addOrEditRoleFormRules: FormRules<typeof addOrEditRoleFormData> = {
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur',
    },
  ],
  roleCode: [
    {
      required: true,
      message: '请输入角色编码',
      trigger: 'blur',
    },
  ],
  roleSort: [
    {
      required: true,
      message: '请输入显示顺序',
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'change',
    },
  ],
}

/**
 * 新增角色
 */
const handleClickAddRole = () => {
  addOrEditRoleDialogTitle.value = '新增角色'
  addOrEditRoleDialogVisible.value = true
  nextTick(() => {
    addOrEditRoleFormRef.value?.resetFields()
  })
}

/**
 * 编辑角色
 */
const handleClickEditRole = (row: RoleInfoVo) => {
  addOrEditRoleDialogTitle.value = '编辑角色'
  addOrEditRoleDialogVisible.value = true
  nextTick(() => {
    addOrEditRoleFormRef.value?.resetFields()
    Object.assign(addOrEditRoleFormData, row)
  })
}

/**
 * 确认新增或编辑
 */
const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditRoleFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditRoleDialogTitle.value === '新增角色') {
    result = await roleModule.addRole(addOrEditRoleFormData)
  } else {
    result = await roleModule.updateRole(addOrEditRoleFormData)
  }

  if (result.code === 200) {
    getRoleList()
    addOrEditRoleDialogVisible.value = false
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
  }
}

/**
 * 删除角色
 */
const handleClickDeleteRole = (row: RoleInfoVo) => {
  ElMessageBox.confirm(`确认要删除角色 【${row.roleName}】 吗?`, '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await roleModule.deleteRole(row.id)
      if (result.code !== 200) return
      getRoleList()
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })
}

/**
 * 禁用角色
 */
const handleClickDisableRole = (row: RoleInfoVo) => {
  console.log(row)
  ElMessageBox.confirm(`确认要禁用角色 【${row.roleName}】 吗?`, '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await roleModule.disableRole(row)
      if (result.code !== 200) return
      getRoleList()
      ElMessage({ type: 'success', message: '操作成功' })
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '操作取消' })
    })
}

/**
 * 启用角色
 */
const handleClickEnableRole = (row: RoleInfoVo) => {
  console.log(row)
  ElMessageBox.confirm(`确认要启用角色 【${row.roleName}】 吗?`, '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await roleModule.enableRole(row)
      if (result.code !== 200) return
      getRoleList()
      ElMessage({ type: 'success', message: '操作成功' })
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '操作取消' })
    })
}

const showSearch = ref(true)

const handlePageSizeChange = (pageSize: number) => {
  roleListInfo.pageNum = 1
  roleListInfo.pageSize = pageSize
  getRoleList()
}

const handlePageNumChange = (pageNum: number) => {
  roleListInfo.pageNum = pageNum
  getRoleList()
}

onMounted(() => {
  getRoleList()
})
</script>

<style lang="less" scoped>
.role-list-container {
  padding: 16px;
  background-color: var(--el-bg-color);
  min-height: 100%;
  border-radius: 4px;

  .role-table {
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

.system-role-dialog {
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
