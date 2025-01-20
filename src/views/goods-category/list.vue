<template>
  <!-- 商品列表 -->
  <el-form
    :model="queryFormData"
    label-width="auto"
    inline
    v-show="showSearch"
  >
    <el-form-item label="商品id">
      <el-input
        v-model="queryFormData.categoryId"
        placeholder="商品id"
        @change="getGoodsCategoryList"
      />
    </el-form-item>
    <el-form-item label="商品名称">
      <el-input
        v-model="queryFormData.categoryName"
        placeholder="商品名称"
        @change="getGoodsCategoryList"
      />
    </el-form-item>
    <el-form-item label="商品等级">
      <el-select
        v-model="queryFormData.categoryLevel"
        style="width: 200px"
        placeholder="商品等级"
        @change="getGoodsCategoryList"
      >
        <el-option label="一级分类" :value="1" />
        <el-option label="二级分类" :value="2" />
        <el-option label="三级分类" :value="3" />
      </el-select>
    </el-form-item>
  </el-form>
  <Handle-ToolBar
    v-model:showSearch="showSearch"
    @queryTableData="getGoodsCategoryList"
  >
    <el-button type="primary" @click="handleClickAddUser">
      新增商品
    </el-button>
  </Handle-ToolBar>

  <el-table
    border
    :data="goodsCategoryList.tableData"
    style="width: 100%"
  >
    <el-table-column
      prop="categoryId"
      label="商品id"
      width="100"
    />
    <el-table-column
      prop="categoryName"
      label="商品名称"
      width="150"
    />
    <el-table-column
      prop="categoryLevel"
      label="商品等级"
    />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="updateTime" label="更新时间" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button
          link
          type="primary"
          size="small"
          @click="handleClickEditUser(row)"
          >编辑</el-button
        >
        <el-button
          link
          type="primary"
          size="small"
          @click="handleClickDeleteUser(row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="goodsCategoryList.pageNum"
    v-model:page-size="goodsCategoryList.pageSize"
    :page-sizes="[10, 20, 30, 40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="goodsCategoryList.total"
    @size-change="goodsCategoryList.handlePageSizeChange"
    @current-change="goodsCategoryList.handlePageNumChange"
  />
  <el-dialog
    v-model="addOrEditUserDialogVisible"
    :title="addOrEditUserDialogTitle"
  >
    <el-form
      ref="addOrEditUserFormRef"
      :model="addOrEditUserFormData"
      :rules="addOrEditUserFormRules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="addOrEditUserFormData.nickName"
          placeholder="请输入用户昵称"
        />
      </el-form-item>
      <el-form-item label="登陆名称" prop="loginName">
        <el-input
          v-model="addOrEditUserFormData.loginName"
          placeholder="请输入登陆名称"
        />
      </el-form-item>
      <el-form-item label="个性签名" prop="introduceSign">
        <el-input
          v-model="addOrEditUserFormData.introduceSign"
          placeholder="请输入个性签名"
        />
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
        <el-input
          v-model="addOrEditUserFormData.address"
          placeholder="请输入收货地址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="addOrEditUserDialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="handleClickAddOrEditConfirm"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { goodsCategoryModule } from '@apis'
import { onMounted, reactive, ref, nextTick } from 'vue'
import {
  type FormInstance,
  type FormRules,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'

interface GoodsCategoryInfo {
  tableData: GoodsCategoryDto[]
  total: number | undefined
  pageSize: number
  pageNum: number
  handlePageSizeChange(pageSize: number): void
  handlePageNumChange(pageNum: number): void
}
/**
 * @description 查询条件
 */
const queryFormData = reactive<GoodsCategoryVo>({
  categoryId: null,
  categoryLevel: null
})
const addOrEditUserDialogTitle = ref('')

const addOrEditUserDialogVisible = ref(false)

const goodsCategoryList = reactive<GoodsCategoryInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
  handlePageSizeChange(pageSize: number) {
    goodsCategoryList.pageSize = pageSize
    getGoodsCategoryList()
  },
  handlePageNumChange(pageNum: number) {
    goodsCategoryList.pageNum = pageNum
    getGoodsCategoryList()
  }
})

/**
 * @description 获取商品列表
 */
const getGoodsCategoryList = async () => {
  const pageSize = goodsCategoryList.pageSize
  const pageNum = goodsCategoryList.pageNum
  const result =
    await goodsCategoryModule.getGoodsCategoryList({
      pageSize,
      pageNum,
      ...queryFormData
    })
  if (result.code === 200) {
    goodsCategoryList.tableData = result.data.data
    goodsCategoryList.total = result.data.total
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
    // result = await goodsCategoryModule.insertUserInfo(
    //   addOrEditUserFormData
    // )
  } else {
    // result = await goodsCategoryModule.updateUserInfo<boolean>(
    //   addOrEditUserFormData
    // )
  }

  // if (result.code === 200) {
  //   getGoodsCategoryList()
  //   addOrEditUserDialogVisible.value = false
  // }
}

const handleClickDeleteUser = (row: GoodsCategoryDto) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const result =
        //   await goodsCategoryModule.deleteUserInfo<boolean>({
        //     userId: row.userId
        //   })
        // if (result.code !== 200) return
        getGoodsCategoryList()
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
  getGoodsCategoryList()
})
</script>
