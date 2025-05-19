<template>
  <el-form
    class="goods-category-info"
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
import { reactive, ref } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { getGoodsCategoryDetail } from '@/apis/goodsCategory'
import { useRoute } from 'vue-router'
const route = useRoute()
const goodsCategoryFormRef = ref<FormInstance>()

const goodsCategoryFormData = reactive<Partial<GoodsCategoryDto>>({
  categoryName: '',
  categoryLevel: '',
})
const goodsCategoryFormRules: FormRules<GoodsCategoryDto> = {}

const getGoodsCategoryFormData = async () => {
  const categoryId = Number(route.query.id)

  // const result = await getGoodsCategoryDetail({ categoryId })
}
</script>
<style lang="less" scoped>
.goods-category-info {
  position: relative;
}
</style>
