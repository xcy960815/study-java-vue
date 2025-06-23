<template>
  <div class="user-list-container">
    <el-form
      :model="queryFormData"
      label-width="auto"
      inline
      v-show="showSearch"
      class="search-form"
    >
      <el-form-item label="用户昵称">
        <el-input v-model="queryFormData.nickName" placeholder="用户昵称" @change="getUserList" />
      </el-form-item>
      <el-form-item label="登陆账号">
        <el-input v-model="queryFormData.loginName" placeholder="登陆账号" @change="getUserList" />
      </el-form-item>
      <!-- 角色 -->
      <el-form-item label="角色">
        <el-select
          v-model="queryFormData.roleIds"
          placeholder="请选择角色"
          @change="getUserList"
          multiple
          style="width: 200px"
        >
          <el-option
            v-for="role of roleList"
            :key="role.id"
            :label="role.roleName"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getUserList">
      <el-button size="small" type="primary" @click="handleClickAddUser"> 新增用户 </el-button>
    </Handle-ToolBar>

    <el-table border :data="userListInfo.tableData" style="width: 100%" class="user-table">
      <el-table-column prop="nickName" label="用户昵称" min-width="100" />
      <el-table-column prop="age" label="用户年龄" min-width="100" />
      <el-table-column prop="loginName" label="登陆账号" min-width="150" />
      <el-table-column prop="roleNames" label="角色" min-width="200">
        <template #default="{ row }">
          <el-tag class="mr-1" v-for="roleName of row.roleNames" :key="roleName" size="small">{{
            roleName
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleCode" label="角色编码" min-width="200">
        <template #default="{ row }">
          <el-tag class="mr-1" v-for="roleCode of row.roleCodes" :key="roleCode" size="small">{{
            roleCode
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="introduceSign" label="个性签名" min-width="200" />
      <el-table-column prop="address" label="收货地址" min-width="200" />
      <el-table-column prop="createTime" label="注册时间" min-width="200" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditUser(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteUser(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="userListInfo.pageNum"
      v-model:page-size="userListInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userListInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
      class="pagination"
    />
    <el-dialog
      v-model="addOrEditUserDialogVisible"
      :title="addOrEditUserDialogTitle"
      class="user-dialog"
    >
      <el-form
        ref="addOrEditUserFormRef"
        :model="addOrEditUserFormData"
        :rules="addOrEditUserFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="addOrEditUserFormData.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="登陆账号" prop="loginName">
          <el-input v-model="addOrEditUserFormData.loginName" placeholder="请输入登陆账号" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="addOrEditUserFormData.roleIds" placeholder="请选择角色" multiple>
            <el-option
              v-for="role of roleList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个性签名" prop="introduceSign">
          <el-input v-model="addOrEditUserFormData.introduceSign" placeholder="请输入个性签名" />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="addOrEditUserFormData.address" placeholder="请输入收货地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { userModule, roleModule } from '@apis'
import { onMounted, reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'userList',
})
const router = useRouter()
interface UserListInfo {
  tableData: UserInfoVo[]
  total: number | undefined
  pageSize: number
  pageNum: number
}

const queryFormData = reactive<UserInfoDto>({
  nickName: '',
  loginName: '',
  introduceSign: '',
  address: '',
  roleIds: [],
})
const addOrEditUserDialogTitle = ref('')

const addOrEditUserDialogVisible = ref(false)

const userListInfo = reactive<UserListInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})
const roleList = ref<RoleInfoVo[]>([])

const getRoleList = async () => {
  const result = await roleModule.getAllRoleList()
  if (result.code === 200) {
    roleList.value = result.data.data
  }
}
/**
 * 获取用户列表
 */
const getUserList = async () => {
  const pageSize = userListInfo.pageSize
  const pageNum = userListInfo.pageNum
  const result = await userModule.getUserList({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    userListInfo.tableData = result.data.data
    userListInfo.total = result.data.total
  }
}

const addOrEditUserFormRef = ref<FormInstance>()

const addOrEditUserFormData = reactive<UserInfoDto>({
  nickName: '',
  loginName: '',
  introduceSign: '',
  address: '',
  avatar: '',
  roleIds: [],
})

const addOrEditUserFormRules: FormRules<typeof addOrEditUserFormData> = {
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur',
    },
  ],
  loginName: [
    {
      required: true,
      message: '请输入登陆账号',
      trigger: 'blur',
    },
  ],
  roleIds: [
    {
      required: true,
      message: '请选择角色',
      type: 'array',
      trigger: 'change',
    },
  ],
  introduceSign: [
    {
      required: true,
      message: '请输入个性签名',
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: '请输入收货地址',
      trigger: 'blur',
    },
  ],
}

/**
 * 新增用户
 */
const handleClickAddUser = async () => {
  await getRoleList()
  addOrEditUserDialogTitle.value = '新增用户'
  addOrEditUserDialogVisible.value = true
  nextTick(() => {
    addOrEditUserFormRef.value?.resetFields()
  })
}

/**
 * 编辑用户
 */
const handleClickEditUser = async (row: UserInfoVo) => {
  await getRoleList()
  addOrEditUserDialogTitle.value = '编辑用户'
  addOrEditUserDialogVisible.value = true
  nextTick(() => {
    addOrEditUserFormRef.value?.resetFields()
    Object.assign(addOrEditUserFormData, row)
  })
}

/**
 * 确认新增或编辑
 */
const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditUserFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditUserDialogTitle.value === '新增用户') {
    result = await userModule.insertUserInfo(addOrEditUserFormData)
  } else {
    result = await userModule.updateUser<boolean>(addOrEditUserFormData)
  }

  if (result.code === 200) {
    getUserList()
    addOrEditUserDialogVisible.value = false
  }
}

/**
 * 删除用户
 */
const handleClickDeleteUser = (row: UserInfoDto) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await userModule.deleteUserInfo<boolean>({
        id: row.id,
      })
      if (result.code !== 200) return
      getUserList()
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

const showSearch = ref(true)

const handlePageSizeChange = (pageSize: number) => {
  userListInfo.pageNum = 1
  userListInfo.pageSize = pageSize
  getUserList()
}

const handlePageNumChange = (pageNum: number) => {
  userListInfo.pageNum = pageNum
  getUserList()
}

onMounted(() => {
  getRoleList()
  getUserList()
})
</script>

<style lang="less" scoped>
.user-list-container {
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

  .user-table {
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 16px 0;
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;

    :deep(.el-pagination__total),
    :deep(.el-pagination__jump) {
      color: var(--el-text-color-regular);
    }

    :deep(.el-pagination__sizes) {
      .el-input__wrapper {
        background-color: var(--el-bg-color);
      }
    }

    :deep(.el-pager li) {
      background-color: var(--el-bg-color);
      color: var(--el-text-color-regular);

      &.is-active {
        color: var(--el-color-primary);
      }

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

.user-dialog {
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
