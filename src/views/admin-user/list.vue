<template>
  <div class="admin-user">
    <el-form :model="queryFormData" label-width="auto" inline v-show="showSearch">
      <el-form-item label="管理员昵称">
        <el-input
          v-model="queryFormData.nickName"
          placeholder="管理员昵称"
          @change="getAdminUserList"
        />
      </el-form-item>
      <el-form-item label="登录名称">
        <el-input
          v-model="queryFormData.loginUserName"
          placeholder="登录名称"
          @change="getAdminUserList"
        />
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getAdminUserList">
      <el-button size="small" type="primary" @click="handleClickAddAdminUser">新增管理员</el-button>
    </Handle-ToolBar>

    <el-table border :data="adminUserListInfo.tableData" style="width: 100%">
      <el-table-column prop="nickName" label="管理员昵称" width="100" />
      <el-table-column prop="loginUserName" label="登录名称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditAdminUser(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteAdminUser(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="adminUserListInfo.pageNum"
      v-model:page-size="adminUserListInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="adminUserListInfo.total"
      @size-change="adminUserListInfo.handlePageSizeChange"
      @current-change="adminUserListInfo.handlePageNumChange"
    />

    <el-dialog v-model="addOrEditAdminUserDialogVisible" :title="addOrEditAdminUserDialogTitle">
      <el-form
        ref="addOrEditAdminUserFormRef"
        :model="addOrEditAdminUserFormData"
        :rules="addOrEditAdminUserFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="管理员昵称" prop="nickName">
          <el-input v-model="addOrEditAdminUserFormData.nickName" placeholder="请输入管理员昵称" />
        </el-form-item>
        <el-form-item label="登录名称" prop="loginUserName">
          <el-input
            v-model="addOrEditAdminUserFormData.loginUserName"
            placeholder="请输入登录名称"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="loginPassword"
          v-if="addOrEditAdminUserDialogTitle === '新增管理员'"
        >
          <el-input
            v-model="addOrEditAdminUserFormData.loginPassword"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditAdminUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { adminUserModule } from '@apis'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'

interface AdminUserListInfo {
  tableData: AdminUserInfoDto[]
  total: number | undefined
  pageSize: number
  pageNum: number
  handlePageSizeChange(pageSize: number): void
  handlePageNumChange(pageNum: number): void
}

/**
 * @description 查询条件
 */
const queryFormData = reactive({
  nickName: '',
  loginUserName: '',
})

const addOrEditAdminUserDialogTitle = ref('')
const addOrEditAdminUserDialogVisible = ref(false)

const adminUserListInfo = reactive<AdminUserListInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
  handlePageSizeChange: (pageSize: number) => {
    adminUserListInfo.pageSize = pageSize
    getAdminUserList()
  },
  handlePageNumChange: (pageNum: number) => {
    adminUserListInfo.pageNum = pageNum
    getAdminUserList()
  },
})

const getAdminUserList = async () => {
  const pageSize = adminUserListInfo.pageSize
  const pageNum = adminUserListInfo.pageNum
  const result = await adminUserModule.getAdminUserList({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    adminUserListInfo.tableData = result.data
    adminUserListInfo.total = result.data.length
  }
}

const addOrEditAdminUserFormRef = ref<FormInstance>()

const addOrEditAdminUserFormData = reactive<Omit<AdminUserInfoDto, 'userId' | 'createTime'>>({
  nickName: '',
  loginUserName: '',
  loginPassword: '',
  adminUserId: 0,
  locked: 0,
})

const addOrEditAdminUserFormRules: FormRules<typeof addOrEditAdminUserFormData> = {
  nickName: [
    {
      required: true,
      message: '请输入管理员昵称',
      trigger: 'blur',
    },
  ],
  loginUserName: [
    {
      required: true,
      message: '请输入登录名称',
      trigger: 'blur',
    },
  ],
  loginPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
}

const handleClickAddAdminUser = () => {
  addOrEditAdminUserDialogTitle.value = '新增管理员'
  addOrEditAdminUserDialogVisible.value = true
  nextTick(() => {
    addOrEditAdminUserFormRef.value?.resetFields()
  })
}

const handleClickEditAdminUser = (row: AdminUserInfoDto) => {
  addOrEditAdminUserDialogTitle.value = '编辑管理员'
  addOrEditAdminUserDialogVisible.value = true
  nextTick(() => {
    addOrEditAdminUserFormRef.value?.resetFields()
    Object.assign(addOrEditAdminUserFormData, row)
  })
}

const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditAdminUserFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditAdminUserDialogTitle.value === '新增管理员') {
    result = await adminUserModule.insertUser(addOrEditAdminUserFormData)
  } else {
    result = await adminUserModule.updateUser<boolean>(addOrEditAdminUserFormData)
  }

  if (result.code === 200) {
    getAdminUserList()
    addOrEditAdminUserDialogVisible.value = false
  }
}

const handleClickDeleteAdminUser = (row: AdminUserInfoDto) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await adminUserModule.deleteUser<boolean>(row.adminUserId)
      if (result.code !== 200) return
      getAdminUserList()
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

onMounted(() => {
  getAdminUserList()
})
</script>

<style lang="less" scoped>
.admin-user {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
