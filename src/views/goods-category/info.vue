<template>
  <el-form
    class="goods-category-info-container h-full w-full relative"
    ref="goodsCategoryFormRef"
    :model="goodsCategoryFormData"
    :rules="goodsCategoryFormRules"
    label-width="auto"
    status-icon
  >
    <el-form-item label="商品名称" prop="categoryName">
      <el-input v-model="goodsCategoryFormData.categoryName" placeholder="请输入商品名称" />
    </el-form-item>
    <el-form-item label="商品等级" prop="categoryLevel">
      <el-input v-model="goodsCategoryFormData.categoryLevel" placeholder="请输入商品等级" />
    </el-form-item>
    <!-- <el-form-item label="个性签名" prop="introduceSign">
            <el-input v-model="goodsCategoryFormData.introduceSign
            " placeholder="请输入个性签名" />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
            <el-input v-model="goodsCategoryFormData.address" placeholder="请输入收货地址" />
        </el-form-item> -->
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { getGoodsCategoryDetail } from '@/apis/goodsCategory'
import { useRoute } from 'vue-router'

const route = useRoute()

/**
 * @description 商品分类表单
 */
const goodsCategoryFormRef = ref<FormInstance>()

/**
 * @description 商品分类表单数据
 */
const goodsCategoryFormData = reactive<Partial<GoodsCategoryVo>>({
  categoryName: '',
  categoryLevel: undefined,
})
/**
 * @description 商品分类表单规则
 */
const goodsCategoryFormRules: FormRules<GoodsCategoryVo> = {}

const getGoodsCategoryFormData = async () => {
  const categoryId = Number(route.query.id)

  const result = await getGoodsCategoryDetail({ categoryId })
  if (result.code === 200) {
    Object.assign(goodsCategoryFormData, result.data)
  }
}
onMounted(() => {
  getGoodsCategoryFormData()
})
</script>
<style lang="less" scoped>
.goods-category-info-container {
  position: relative;
}
</style>
