<template>
  <el-form :model="queryFormData" label-width="auto" inline v-show="showSearch">
    <el-form-item label="用户昵称">
      <el-input v-model="queryFormData.nickName" placeholder="用户昵称" @change="getUserList" />
    </el-form-item>
    <el-form-item label="登陆名称">
      <el-input v-model="queryFormData.loginName" placeholder="登陆名称" @change="getUserList" />
    </el-form-item>
    <el-form-item label="个性签名">
      <el-input v-model="queryFormData.introduceSign" placeholder="个性签名" @change="getUserList" />
    </el-form-item>
    <el-form-item label="收货地址">
      <el-input v-model="queryFormData.address" placeholder="收货地址" @change="getUserList" />
    </el-form-item>
  </el-form>
  <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getUserList">
    <el-button size="small" type="primary" @click="handleClickAddUser">
      新增用户
    </el-button>
  </Handle-ToolBar>

  <el-table border :data="userListInfo.tableData" style="width: 100%">
    <el-table-column prop="nickName" label="用户昵称" width="100" />
    <el-table-column prop="age" label="用户年龄" width="100" />
    <el-table-column prop="loginName" label="登陆名称" />
    <el-table-column prop="introduceSign" label="个性签名" />
    <el-table-column prop="address" label="收货地址" />
    <el-table-column prop="createTime" label="注册时间" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="handleClickEditUser(row)">编辑</el-button>
        <el-button link type="primary" size="small" @click="handleClickDeleteUser(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="userListInfo.pageNum" v-model:page-size="userListInfo.pageSize"
    :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="userListInfo.total"
    @size-change="userListInfo.handlePageSizeChange" @current-change="userListInfo.handlePageNumChange" />
  <el-dialog v-model="addOrEditUserDialogVisible" :title="addOrEditUserDialogTitle">
    <el-form ref="addOrEditUserFormRef" :model="addOrEditUserFormData" :rules="addOrEditUserFormRules"
      label-width="auto" status-icon>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="addOrEditUserFormData.nickName" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="登陆名称" prop="loginName">
        <el-input v-model="addOrEditUserFormData.loginName" placeholder="请输入登陆名称" />
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
        <el-button type="primary" @click="handleClickAddOrEditConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: "userList"
}
</script>
<script setup lang="ts">
import { userModule } from '@apis'
import { onMounted, reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
// defineOptions({
//   name: "userList"
// })
interface UserListInfo {
  tableData: UserInfoDto[]
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
  loginName: '',
  introduceSign: '',
  address: ''
})
const addOrEditUserDialogTitle = ref('')

const addOrEditUserDialogVisible = ref(false)

const userListInfo = reactive<UserListInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
  handlePageSizeChange(pageSize: number) {
    userListInfo.pageSize = pageSize
    getUserList()
  },
  handlePageNumChange(pageNum: number) {
    userListInfo.pageNum = pageNum
    getUserList()
  }
})

const getUserList = async () => {
  const pageSize = userListInfo.pageSize
  const pageNum = userListInfo.pageNum
  const result = await userModule.getUserList({
    pageSize,
    pageNum,
    ...queryFormData
  })
  if (result.code === 200) {
    userListInfo.tableData = result.data.data
    userListInfo.total = result.data.total
    // userListInfo.total = undefined
  }
}

const addOrEditUserFormRef = ref<FormInstance>()

const addOrEditUserFormData = reactive<
  Omit<UserInfoDto, 'userId' | 'age' | 'createTime'>
>({
  nickName: '',
  loginName: '',
  introduceSign: '',
  address: '',
  // passwordMd5: 'e10adc3949ba59abbe56e057f20f883e',
  avatar: ''
})

const addOrEditUserFormRules: FormRules<
  typeof addOrEditUserFormData
> = {
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    }
  ],
  loginName: [
    {
      required: true,
      message: '请输入登陆名称',
      trigger: 'blur'
    }
  ],
  introduceSign: [
    {
      required: true,
      message: '请输入个性签名',
      trigger: 'blur'
    }
  ],
  address: [
    {
      required: true,
      message: '请输入收货地址',
      trigger: 'blur'
    }
  ]
}

const handleClickAddUser = () => {
  addOrEditUserDialogTitle.value = '新增用户'
  addOrEditUserDialogVisible.value = true
  nextTick(() => {
    addOrEditUserFormRef.value?.resetFields()
  })
}

const handleClickEditUser = (row: UserInfoDto) => {
  addOrEditUserDialogTitle.value = '编辑用户'
  addOrEditUserDialogVisible.value = true
  nextTick(() => {
    addOrEditUserFormRef.value?.resetFields()
    Object.assign(addOrEditUserFormData, row)
  })
}

const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditUserFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditUserDialogTitle.value === '新增用户') {
    result = await userModule.insertUserInfo(
      addOrEditUserFormData
    )
  } else {
    result = await userModule.updateUserInfo<boolean>(
      addOrEditUserFormData
    )
  }

  if (result.code === 200) {
    getUserList()
    addOrEditUserDialogVisible.value = false
  }
}

const handleClickDeleteUser = (row: UserInfoDto) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const result =
        await userModule.deleteUserInfo<boolean>({
          userId: row.userId
        })
      if (result.code !== 200) return
      getUserList()
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}

const showSearch = ref(true)

onMounted(() => {
  getUserList()
})

</script>
