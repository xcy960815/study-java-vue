<template>
  <!-- 商品列表 -->
  <div class="goods-list-container h-full w-full relative">
    <el-form :model="queryFormData" label-width="auto" inline v-show="showSearch">
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
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getGoodsCategoryList">
      <el-button size="small" type="primary" @click="handleClickAddGoodCategory">
        新增商品
      </el-button>
    </Handle-ToolBar>

    <el-table border :data="goodsCategoryInfo.tableData" style="width: 100%">
      <el-table-column prop="categoryId" label="商品id" width="100" />
      <el-table-column prop="categoryName" label="商品名称" width="150" />
      <el-table-column prop="categoryLevel" label="商品等级" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleClickEditGoodCategoryDetail(row)"
            >详情</el-button
          >
          <el-button link type="primary" size="small" @click="handleClickEditGoodCategory(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteGoodsCategory(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="goodsCategoryInfo.pageNum"
      v-model:page-size="goodsCategoryInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsCategoryInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
    />

    <!-- 新增或编辑商品 -->
    <el-dialog
      v-model="addOrEditGoodsCategoryDialogVisible"
      :title="addOrEditGoodsCategoryDialogTitle"
    >
      <el-form
        ref="addOrEditGoodsCategoryFormRef"
        :model="addOrEditGoodsCategoryFormData"
        :rules="addOrEditGoodsCategoryFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="商品名称" prop="categoryName">
          <el-input
            v-model="addOrEditGoodsCategoryFormData.categoryName"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="商品等级" prop="categoryLevel">
          <el-input
            v-model="addOrEditGoodsCategoryFormData.categoryLevel"
            placeholder="请输入商品等级"
          />
        </el-form-item>
        <!-- <el-form-item label="个性签名" prop="introduceSign">
        <el-input v-model="addOrEditGoodsCategoryFormData.introduceSign
          " placeholder="请输入个性签名" />
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
        <el-input v-model="addOrEditGoodsCategoryFormData.address" placeholder="请输入收货地址" />
      </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditGoodsCategoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { goodsCategoryModule } from '@apis'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
defineOptions({
  name: 'goods-category-list',
})
interface GoodsCategoryInfo {
  tableData: GoodsCategoryVo[]
  total: number | undefined
  pageSize: number
  pageNum: number
}
/**
 * @description 查询条件
 */
const queryFormData = reactive<GoodsCategoryDto>({
  categoryId: undefined,
  categoryLevel: 0,
})

const addOrEditGoodsCategoryDialogTitle = ref('')

const addOrEditGoodsCategoryDialogVisible = ref(false)

const goodsCategoryInfo = reactive<GoodsCategoryInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

const handlePageSizeChange = (pageSize: number) => {
  goodsCategoryInfo.pageSize = pageSize
  getGoodsCategoryList()
}
const handlePageNumChange = (pageNum: number) => {
  goodsCategoryInfo.pageNum = pageNum
  getGoodsCategoryList()
}

/**
 * @description 获取商品列表
 */
const getGoodsCategoryList = async () => {
  const pageSize = goodsCategoryInfo.pageSize
  const pageNum = goodsCategoryInfo.pageNum
  const result = await goodsCategoryModule.getGoodsCategoryList({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    goodsCategoryInfo.tableData = result.data.data
    goodsCategoryInfo.total = result.data.total
  }
}

/**
 * @description 新增或编辑商品表单
 */
const addOrEditGoodsCategoryFormRef = ref<FormInstance>()

/**
 * @description 新增或编辑商品表单数据
 */
const addOrEditGoodsCategoryFormData = reactive<GoodsCategoryDto>({
  categoryId: undefined,

  /**
   * 分类级别(1-一级分类 2-二级分类 3-三级分类)
   */
  categoryLevel: 0,

  /**
   * 父分类id
   */
  parentId: 0,

  /**
   * 分类名称
   */
  categoryName: '',

  /**
   * 排序值(字段越大越靠前)
   */
  categoryRank: 0,
})

const addOrEditGoodsCategoryFormRules: FormRules<GoodsCategoryVo> = {}

/**
 * @description 新增商品
 */
const handleClickAddGoodCategory = () => {
  addOrEditGoodsCategoryDialogTitle.value = '新增商品'
  addOrEditGoodsCategoryDialogVisible.value = true
  nextTick(() => {
    addOrEditGoodsCategoryFormRef.value?.resetFields()
  })
}

const router = useRouter()

/**
 * @description 编辑商品详情
 */
const handleClickEditGoodCategoryDetail = (row: GoodsCategoryDto) => {
  router.push({
    path: `/goods-category/info`,
    query: {
      id: row.categoryId,
    },
  })
}

/**
 * @description 编辑商品
 */
const handleClickEditGoodCategory = (row: UserInfoDto) => {
  addOrEditGoodsCategoryDialogTitle.value = '编辑商品'
  addOrEditGoodsCategoryDialogVisible.value = true
  nextTick(() => {
    addOrEditGoodsCategoryFormRef.value?.resetFields()
    Object.assign(addOrEditGoodsCategoryFormData, row)
  })
}

/**
 * @description 确认新增或编辑
 */
const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditGoodsCategoryFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditGoodsCategoryDialogTitle.value === '新增商品') {
    result = await goodsCategoryModule.insertGoodsCategory(addOrEditGoodsCategoryFormData)
  } else {
    result = await goodsCategoryModule.updateGoodsCategory(addOrEditGoodsCategoryFormData)
  }

  if (result.code === 200) {
    getGoodsCategoryList()
    addOrEditGoodsCategoryDialogVisible.value = false
  }
}

/**
 * @description 删除商品
 */
const handleClickDeleteGoodsCategory = (row: GoodsCategoryVo) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await goodsCategoryModule.deleteGoodsCategory<boolean>(row.categoryId)
      if (result.code !== 200) return
      getGoodsCategoryList()
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
  getGoodsCategoryList()
})
</script>
