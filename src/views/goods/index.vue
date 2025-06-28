<template>
  <!-- 商品列表 -->
  <div class="goods-list-container h-full w-full relative">
    <el-form :model="queryFormData" label-width="auto" inline v-show="showSearch">
      <el-form-item label="商品名称">
        <el-input v-model="queryFormData.goodsName" placeholder="商品名称" @change="getGoodsList" />
      </el-form-item>
      <el-form-item label="分类ID">
        <el-input
          v-model="queryFormData.goodsCategoryId"
          placeholder="分类ID"
          @change="getGoodsList"
        />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select
          v-model="queryFormData.goodsSellStatus"
          placeholder="上架状态"
          @change="getGoodsList"
        >
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getGoodsList">
      <el-button size="small" type="primary" @click="handleClickAddGoods">新增商品</el-button>
    </Handle-ToolBar>

    <!-- 商品表格 -->
    <el-table border :data="goodsInfo.tableData" style="width: 100%">
      <el-table-column prop="goodsId" label="商品ID" width="100" />
      <el-table-column prop="goodsName" label="商品名称" width="150" />
      <el-table-column prop="goodsIntro" label="商品简介" />
      <el-table-column prop="goodsCategoryId" label="分类ID" />
      <el-table-column prop="goodsCoverImg" label="封面图" />
      <el-table-column prop="goodsCarousel" label="轮播图" />
      <el-table-column prop="originalPrice" label="原价" />
      <el-table-column prop="sellingPrice" label="售价" />
      <el-table-column prop="stockNum" label="库存" />
      <el-table-column prop="tag" label="标签" />
      <el-table-column prop="goodsSellStatus" label="上架状态">
        <template #default="{ row }">
          {{ row.goodsSellStatus === 1 ? '上架' : '下架' }}
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateUser" label="更新人" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditGoods(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteGoods(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="goodsInfo.pageNum"
      v-model:page-size="goodsInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
    />

    <!-- 新增/编辑商品弹窗 -->
    <el-dialog v-model="addOrEditGoodsDialogVisible" :title="addOrEditGoodsDialogTitle">
      <el-form
        ref="addOrEditGoodsFormRef"
        :model="addOrEditGoodsFormData"
        :rules="addOrEditGoodsFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="addOrEditGoodsFormData.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品简介" prop="goodsIntro">
          <el-input v-model="addOrEditGoodsFormData.goodsIntro" placeholder="请输入商品简介" />
        </el-form-item>
        <el-form-item label="分类ID" prop="goodsCategoryId">
          <el-input v-model="addOrEditGoodsFormData.goodsCategoryId" placeholder="请输入分类ID" />
        </el-form-item>
        <el-form-item label="封面图" prop="goodsCoverImg">
          <el-input v-model="addOrEditGoodsFormData.goodsCoverImg" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-form-item label="轮播图" prop="goodsCarousel">
          <el-input v-model="addOrEditGoodsFormData.goodsCarousel" placeholder="请输入轮播图URL" />
        </el-form-item>
        <el-form-item label="商品详情" prop="goodsDetailContent">
          <el-input
            v-model="addOrEditGoodsFormData.goodsDetailContent"
            type="textarea"
            placeholder="请输入商品详情"
          />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="addOrEditGoodsFormData.originalPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="售价" prop="sellingPrice">
          <el-input v-model="addOrEditGoodsFormData.sellingPrice" placeholder="请输入售价" />
        </el-form-item>
        <el-form-item label="库存" prop="stockNum">
          <el-input v-model="addOrEditGoodsFormData.stockNum" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="addOrEditGoodsFormData.tag" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="上架状态" prop="goodsSellStatus">
          <el-select v-model="addOrEditGoodsFormData.goodsSellStatus" placeholder="请选择上架状态">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditGoodsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { goodsModule } from '@apis'

interface GoodsInfo {
  tableData: GoodsVo[]
  total: number
  pageSize: number
  pageNum: number
}

const queryFormData = reactive<GoodsDto>({
  goodsName: '',
  goodsCategoryId: undefined,
  goodsSellStatus: undefined,
})

const addOrEditGoodsDialogTitle = ref('')
const addOrEditGoodsDialogVisible = ref(false)

const goodsInfo = reactive<GoodsInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

const handlePageSizeChange = (pageSize: number) => {
  goodsInfo.pageSize = pageSize
  getGoodsList()
}
const handlePageNumChange = (pageNum: number) => {
  goodsInfo.pageNum = pageNum
  getGoodsList()
}

const getGoodsList = async () => {
  const result = await goodsModule.getGoodsList({
    ...queryFormData,
    pageSize: goodsInfo.pageSize,
    pageNum: goodsInfo.pageNum,
  })
  if (result.code === 200) {
    goodsInfo.tableData = result.data.data
    goodsInfo.total = result.data.total
  }
}

const addOrEditGoodsFormRef = ref<FormInstance>()
const addOrEditGoodsFormData = reactive<GoodsDto>({
  goodsName: '',
  goodsIntro: '',
  goodsCategoryId: undefined,
  goodsCoverImg: '',
  goodsCarousel: '',
  goodsDetailContent: '',
  originalPrice: undefined,
  sellingPrice: undefined,
  stockNum: undefined,
  tag: '',
  goodsSellStatus: undefined,
})
const addOrEditGoodsFormRules: FormRules<GoodsVo> = {
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goodsCategoryId: [{ required: true, message: '请输入分类ID', trigger: 'blur' }],
  sellingPrice: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  stockNum: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  goodsSellStatus: [{ required: true, message: '请选择上架状态', trigger: 'change' }],
}

const handleClickAddGoods = () => {
  addOrEditGoodsDialogTitle.value = '新增商品'
  addOrEditGoodsDialogVisible.value = true
  nextTick(() => {
    addOrEditGoodsFormRef.value?.resetFields()
  })
}

const handleClickEditGoods = (row: GoodsVo) => {
  addOrEditGoodsDialogTitle.value = '编辑商品'
  addOrEditGoodsDialogVisible.value = true
  nextTick(() => {
    addOrEditGoodsFormRef.value?.resetFields()
    Object.assign(addOrEditGoodsFormData, row)
  })
}

const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditGoodsFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditGoodsDialogTitle.value === '新增商品') {
    // result = await insertGoods(addOrEditGoodsFormData)
  } else {
    // result = await updateGoods(addOrEditGoodsFormData)
  }
  // if (result.code === 200) {
  //   getGoodsList()
  //   addOrEditGoodsDialogVisible.value = false
  // }
}

const handleClickDeleteGoods = (row: GoodsVo) => {
  ElMessageBox.confirm('确认要删除该商品吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // const result = await deleteGoods<boolean>(row.goodsId)
      // if (result.code !== 200) return
      // getGoodsList()
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
  getGoodsList()
})
</script>
