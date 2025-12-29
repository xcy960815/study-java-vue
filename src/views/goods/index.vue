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
          clearable
          placeholder="上架状态"
          @change="getGoodsList"
          class="!w-60"
        >
          <el-option
            v-for="item in goodsSellStatusOptions"
            :key="item.id"
            :label="item.dictName"
            :value="Number(item.dictValue)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getGoodsList">
      <el-button type="primary" @click="handleClickAddGoods">新增商品</el-button>
    </Handle-ToolBar>

    <!-- 商品表格 -->
    <el-table border :data="goodsInfo.tableData" style="width: 100%">
      <el-table-column align="center" prop="goodsId" label="商品ID" width="100" />
      <el-table-column align="center" prop="goodsName" label="商品名称" width="150" />
      <el-table-column align="center" prop="goodsIntro" label="商品简介" width="200" />
      <el-table-column align="center" prop="goodsCategoryId" label="分类ID" width="100" />
      <el-table-column align="center" prop="goodsCoverImg" label="封面图" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.goodsCoverImg"
            :src="row.goodsCoverImg"
            fit="cover"
            style="width: 80px; height: 80px"
            :preview-src-list="[row.goodsCoverImg]"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="goodsCarousel" label="轮播图" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.goodsCarousel"
            :src="row.goodsCarousel"
            fit="cover"
            style="width: 80px; height: 80px"
            :preview-src-list="getCarouselImageList(row.goodsCarousel)"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="originalPrice" label="原价" width="100" />
      <el-table-column align="center" prop="sellingPrice" label="售价" width="100" />
      <el-table-column align="center" prop="stockNum" label="库存" width="100" />
      <el-table-column align="center" prop="tag" label="标签" width="100" />
      <el-table-column align="center" prop="goodsSellStatus" label="上架状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getGoodsSellStatusTagType(row.goodsSellStatus)">
            {{ getGoodsSellStatusName(row.goodsSellStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createUser" label="创建人" width="100" />
      <el-table-column align="center" prop="createTime" label="创建时间" width="200" />
      <el-table-column align="center" prop="updateUser" label="更新人" width="100" />
      <el-table-column align="center" prop="updateTime" label="更新时间" width="200" />
      <el-table-column align="center" fixed="right" label="操作" width="150">
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
            <el-option
              v-for="item in goodsSellStatusOptions"
              :key="item.id"
              :label="item.dictName"
              :value="Number(item.dictValue)"
            />
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
import { getDataDictList } from '@/apis/system/dataDict'

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
  goodsInfo.tableData = result.data
  goodsInfo.total = result.total
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

// 商品上架状态选项
const goodsSellStatusOptions = ref<DataDictionaryVo[]>([])

/**
 * 获取商品上架状态字典
 */
const getGoodsSellStatusDict = async () => {
  try {
    const res = await getDataDictList({
      dictType: 'goods_sell_status',
      status: 1,
      pageNum: 1,
      pageSize: 100,
    })
    goodsSellStatusOptions.value = res.data
  } catch (error) {
    console.error('获取商品上架状态字典失败:', error)
  }
}

/**
 * 根据上架状态值获取状态名称
 */
const getGoodsSellStatusName = (statusValue: number): string => {
  const status = goodsSellStatusOptions.value.find((item) => Number(item.dictValue) === statusValue)
  return status?.dictName || String(statusValue)
}

/**
 * 根据上架状态值获取标签类型
 */
const getGoodsSellStatusTagType = (
  statusValue: number
): 'success' | 'primary' | 'warning' | 'info' | 'danger' | undefined => {
  if (statusValue === 1) return 'success' // 上架
  if (statusValue === 0) return 'info' // 下架
  return undefined
}

/**
 * 获取轮播图第一张图片
 */
const getFirstCarouselImage = (carousel: string): string => {
  if (!carousel) return ''
  const images = carousel.split(',')
  return images[0]?.trim() || ''
}

/**
 * 获取轮播图所有图片列表（用于预览）
 */
const getCarouselImageList = (carousel: string): string[] => {
  if (!carousel) return []
  return carousel
    .split(',')
    .map((img) => img.trim())
    .filter(Boolean)
}

onMounted(() => {
  getGoodsSellStatusDict()
  getGoodsList()
})
</script>
