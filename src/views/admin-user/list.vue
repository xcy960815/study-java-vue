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
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
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
  tableData: AdminUserInfoVo[]
  total: number
  pageSize: number
  pageNum: number
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

/**
 * @description 管理员列表信息
 */
const adminUserListInfo = reactive<AdminUserListInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

/**
 * @description 获取管理员列表
 */
const getAdminUserList = async () => {
  const pageSize = adminUserListInfo.pageSize
  const pageNum = adminUserListInfo.pageNum
  const result = await adminUserModule.getAdminUserList<ListResponseResult<AdminUserInfoVo>>({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    adminUserListInfo.tableData = result.data.data
    adminUserListInfo.total = result.data.total
  }
}

const addOrEditAdminUserFormRef = ref<FormInstance>()

/**
 * @description 新增或编辑管理员表单数据
 */
const addOrEditAdminUserFormData = reactive<Omit<AdminUserInfoDto, 'userId' | 'createTime'>>({
  nickName: '',
  loginUserName: '',
  loginPassword: '',
  adminUserId: 0,
  locked: 0,
})

/**
 * @description 新增或编辑管理员表单验证规则
 */
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

/**
 * @description 新增管理员
 */
const handleClickAddAdminUser = () => {
  addOrEditAdminUserDialogTitle.value = '新增管理员'
  addOrEditAdminUserDialogVisible.value = true
  nextTick(() => {
    addOrEditAdminUserFormRef.value?.resetFields()
  })
}

/**
 * @description 编辑管理员
 */
const handleClickEditAdminUser = (row: AdminUserInfoDto) => {
  addOrEditAdminUserDialogTitle.value = '编辑管理员'
  addOrEditAdminUserDialogVisible.value = true
  nextTick(() => {
    addOrEditAdminUserFormRef.value?.resetFields()
    Object.assign(addOrEditAdminUserFormData, row)
  })
}

/**
 * @description 确认新增或编辑管理员
 */
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

/**
 * @description 删除管理员
 */
const handleClickDeleteAdminUser = (row: AdminUserInfoVo) => {
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

const handlePageSizeChange = (pageSize: number) => {
  adminUserListInfo.pageSize = pageSize
  getAdminUserList()
}

const handlePageNumChange = (pageNum: number) => {
  adminUserListInfo.pageNum = pageNum
  getAdminUserList()
}

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
