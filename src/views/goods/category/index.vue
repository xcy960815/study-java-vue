<template>
  <div class="h-full w-full">
    <div class="mb-4">
      <el-button v-hasPermi="['goods:add']" type="primary" @click="openCreate()">
        新增分类
      </el-button>
    </div>
    <el-table
      border
      row-key="categoryId"
      :data="categoryTree"
      :tree-props="{ children: 'children' }"
      default-expand-all
    >
      <el-table-column prop="categoryName" label="分类名称" min-width="180" />
      <el-table-column prop="categoryLevel" label="层级" width="80" align="center" />
      <el-table-column prop="orderNum" label="排序" width="80" align="center" />
      <el-table-column label="操作" width="220" align="center">
        <template #default="{ row }">
          <el-button v-hasPermi="['goods:add']" link type="primary" @click="openCreate(row)">
            新增下级
          </el-button>
          <el-button v-hasPermi="['goods:edit']" link type="primary" @click="openEdit(row)">
            编辑
          </el-button>
          <el-button v-hasPermi="['goods:remove']" link type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="parentOptions"
            :props="{ label: 'categoryName', value: 'categoryId', children: 'children' }"
            check-strictly
            placeholder="顶级分类"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from 'element-plus'
import { goodsModule } from '@apis'

const categoryTree = ref<GoodsCategoryVo[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const editingId = ref<number>()
const formRef = ref<FormInstance>()
const form = reactive<GoodsCategoryDto>({
  parentId: 0,
  categoryName: '',
  orderNum: 0,
})
const rules: FormRules<GoodsCategoryDto> = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择上级分类', trigger: 'change' }],
}

const parentOptions = computed<GoodsCategoryVo[]>(() => [
  {
    categoryId: 0,
    parentId: 0,
    categoryName: '顶级分类',
    categoryLevel: 0,
    orderNum: 0,
    children: excludeCategory(categoryTree.value, editingId.value),
  },
])

const excludeCategory = (nodes: GoodsCategoryVo[], categoryId?: number): GoodsCategoryVo[] =>
  nodes
    .filter((node) => node.categoryId !== categoryId)
    .map((node) => ({
      ...node,
      children: node.children ? excludeCategory(node.children, categoryId) : undefined,
    }))

const loadTree = async () => {
  categoryTree.value = await goodsModule.getGoodsCategoryTree()
}

const openCreate = (parent?: GoodsCategoryVo) => {
  editingId.value = undefined
  dialogTitle.value = parent ? `新增「${parent.categoryName}」的下级` : '新增分类'
  dialogVisible.value = true
  form.categoryId = undefined
  form.parentId = parent?.categoryId ?? 0
  form.categoryName = ''
  form.orderNum = 0
}

const openEdit = (row: GoodsCategoryVo) => {
  editingId.value = row.categoryId
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
  form.categoryId = row.categoryId
  form.parentId = row.parentId
  form.categoryName = row.categoryName
  form.orderNum = row.orderNum
}

const handleSubmit = async () => {
  const valid = await formRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)
  if (!valid) {
    return
  }
  if (editingId.value) {
    await goodsModule.updateGoodsCategory({ ...form, categoryId: editingId.value })
    ElMessage.success('更新成功')
  } else {
    await goodsModule.insertGoodsCategory({ ...form })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  await loadTree()
}

const handleDelete = (row: GoodsCategoryVo) => {
  ElMessageBox.confirm(`确认删除分类「${row.categoryName}」？`, '警告', { type: 'warning' })
    .then(async () => {
      try {
        await goodsModule.deleteGoodsCategory(row.categoryId)
        ElMessage.success('删除成功')
        await loadTree()
      } catch {
        // 失败提示由请求拦截器弹出
      }
    })
    .catch(() => undefined)
}

onMounted(() => {
  void loadTree()
})
</script>
