<template>
  <div class="system-menu-container">
    <el-form
      :model="queryFormData"
      ref="queryFormRef"
      label-width="auto"
      inline
      v-show="showSearch"
    >
      <el-form-item label="菜单名称">
        <el-input v-model="queryFormData.menuName" placeholder="菜单名称" @change="fetchMenuList" />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-select
          v-model="queryFormData.menuType"
          style="width: 200px"
          placeholder="菜单类型"
          @change="fetchMenuList"
        >
          <el-option label="目录" :value="0" />
          <el-option label="菜单" :value="1" />
          <el-option label="按钮" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>

    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="fetchMenuList">
      <el-button size="small" type="primary" @click="handleClickAddMenu">新增菜单</el-button>
    </Handle-ToolBar>

    <el-table
      border
      :data="menuListInfo.treeData"
      row-key="menuId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column prop="menuName" label="菜单名称" width="120" />
      <el-table-column prop="path" label="菜单路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="icon" label="图标" width="80" align="center">
        <template #default="{ row }">
          <icon v-if="row.icon" :name="row.icon" />
          <span v-else>无icon</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="row.menuType === 0 ? 'success' : row.menuType === 1 ? 'warning' : 'info'">
            {{ row.menuType === 0 ? '目录' : row.menuType === 1 ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" />
      <el-table-column prop="orderNum" label="排序" width="80" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditMenu(row)"
            >编辑</el-button
          >
          <el-button link type="primary" size="small" @click="handleClickCopyMenu(row)"
            >复制</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            v-if="hasCreateSubMenu(row)"
            @click="handleClickCreateSubMenu(row)"
            >创建子菜单</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteMenu(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="menuListInfo.pageNum"
      v-model:page-size="menuListInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="menuListInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
    />

    <el-dialog v-model="addOrEditMenuDialogVisible" :title="addOrEditMenuDialogTitle">
      <el-form
        ref="addOrEditMenuFormRef"
        :model="addOrEditMenuFormData"
        :rules="addOrEditMenuFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="父菜单">
          <el-tree-select
            v-model="addOrEditMenuFormData.parentId"
            :data="menuTreeData"
            :props="{ label: 'menuName', value: 'menuId' }"
            placeholder="请选择父菜单"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addOrEditMenuFormData.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="addOrEditMenuFormData.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <FileTree v-model="addOrEditMenuFormData.component" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <MenuIconSelector v-model="addOrEditMenuFormData.icon" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="addOrEditMenuFormData.menuType">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="addOrEditMenuFormData.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="addOrEditMenuFormData.orderNum" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditMenuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClickAddOrEditConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed, ref, nextTick } from 'vue'
import { getMenuTree, addMenu, updateMenu, deleteMenu } from '@/apis/system/menu'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import FileTree from './components/file-tree-selector.vue'
import MenuIconSelector from './components/menu-icon-selector.vue'
import { useAsyncComputed } from '@/plugins/async-computed'

interface MenuListInfo {
  treeData: Array<StudyJavaSysMenuVo & { hasChildren: boolean }>
  total: number | undefined
  pageSize: number
  pageNum: number
}

const queryFormRef = ref<FormInstance>()

/**
 * @description 查询条件
 */
const queryFormData = reactive({
  menuName: '',
  menuType: undefined,
})

const showSearch = ref(true)

const addOrEditMenuDialogTitle = ref('')

const addOrEditMenuDialogVisible = ref(false)

/**
 * @description 菜单树数据
 */
const menuTreeData = useAsyncComputed(async () => {
  const queryParams = {
    pageSize: 1000,
    pageNum: 1,
  }
  const result = await getMenuTree(queryParams)
  return filterMenuTree(result.data.data)
})

// 递归过滤菜单树
const filterMenuTree = <R extends StudyJavaSysMenuVo>(tree: R[]): R[] => {
  return tree
    .filter((item: R) => item.menuType === 0)
    .map((item: R) => {
      const children = item.children
      if (children && children.length > 0) {
        return {
          ...item,
          children: filterMenuTree(children),
        }
      }
      return item
    })
}

/**
 * @description 菜单列表信息
 */
const menuListInfo = reactive<MenuListInfo>({
  treeData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

/**
 * @description 处理页码大小变化
 * @param {number} pageSize 页码大小
 */
const handlePageSizeChange = (pageSize: number) => {
  menuListInfo.pageNum = 1
  menuListInfo.pageSize = pageSize
  fetchMenuList()
}

/**
 * @description 处理页码变化
 * @param {number} pageNum 页码
 */
const handlePageNumChange = (pageNum: number) => {
  menuListInfo.pageNum = pageNum
  fetchMenuList()
}

/**
 * @description 查询菜单列表
 */
const fetchMenuList = async () => {
  const pageSize = menuListInfo.pageSize
  const pageNum = menuListInfo.pageNum
  const result = await getMenuTree({
    pageSize,
    pageNum,
    ...queryFormData,
  })
  if (result.code === 200) {
    menuListInfo.treeData = handleMenuTreeData(result.data.data)
    menuListInfo.total = result.data.total
  }
}

const handleMenuTreeData = <R extends StudyJavaSysMenuVo>(
  data?: R[]
): Array<R & { hasChildren: boolean }> => {
  if (!data) return []
  return data.map((item) => ({
    ...item,
    hasChildren: Boolean(item.children?.length),
    children: handleMenuTreeData(item.children),
  }))
}

const addOrEditMenuFormRef = ref<FormInstance>()

/**
 * @description 新增或编辑菜单表单数据
 */
const addOrEditMenuFormData = reactive<StudyJavaSysMenuDto>({
  menuId: undefined,
  parentId: 0,
  menuName: '',
  path: '',
  component: '',
  icon: '',
  menuType: 0,
  perms: '',
  orderNum: 0,
})

/**
 * @description 新增或编辑菜单表单验证规则
 */
const addOrEditMenuFormRules: FormRules<StudyJavaSysMenuDto> = {
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: true,
      message: '请输入菜单路径',
      trigger: 'blur',
    },
  ],
  component: [
    {
      required: true,
      message: '请输入组件路径',
      trigger: 'blur',
    },
  ],
  menuType: [
    {
      required: true,
      message: '请选择菜单类型',
      trigger: 'change',
    },
  ],
}

/**
 * @description 新增菜单
 */
const handleClickAddMenu = () => {
  addOrEditMenuDialogTitle.value = '新增菜单'
  addOrEditMenuDialogVisible.value = true
  nextTick(() => {
    addOrEditMenuFormRef.value?.resetFields()
  })
}

/**
 * @description 编辑菜单
 * @param {StudyJavaSysMenuDto} row
 */
const handleClickEditMenu = (row: StudyJavaSysMenuVo) => {
  addOrEditMenuDialogTitle.value = '编辑菜单'
  addOrEditMenuDialogVisible.value = true
  nextTick(() => {
    addOrEditMenuFormRef.value?.resetFields()
    Object.assign(addOrEditMenuFormData, row)
  })
}

/**
 * @description 复制菜单
 * @param {StudyJavaSysMenuVo} row
 */
const handleClickCopyMenu = (row: StudyJavaSysMenuVo) => {
  addOrEditMenuDialogTitle.value = '复制菜单'
  addOrEditMenuDialogVisible.value = true
  nextTick(() => {
    addOrEditMenuFormRef.value?.resetFields()
    Object.assign(addOrEditMenuFormData, row)
    addOrEditMenuFormData.menuId = undefined
  })
}

/**
 * @description 判断是否可以创建子菜单
 * @param {StudyJavaSysMenuVo} row
 */
const hasCreateSubMenu = computed(() => (row: StudyJavaSysMenuVo) => {
  return row.menuType === 0
})

/**
 * @description 创建子菜单
 * @param {StudyJavaSysMenuVo} row
 */
const handleClickCreateSubMenu = (row: StudyJavaSysMenuVo) => {
  addOrEditMenuDialogTitle.value = '创建子菜单'
  addOrEditMenuDialogVisible.value = true
  nextTick(() => {
    addOrEditMenuFormRef.value?.resetFields()
    // Object.assign(addOrEditMenuFormData, row)
    addOrEditMenuFormData.menuId = undefined
    addOrEditMenuFormData.parentId = row.menuId
  })
}

/**
 * @description 新增或编辑菜单确认
 */
const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditMenuFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditMenuDialogTitle.value === '新增菜单') {
    result = await addMenu(addOrEditMenuFormData)
  } else if (addOrEditMenuDialogTitle.value === '编辑菜单') {
    result = await updateMenu(addOrEditMenuFormData)
  } else if (addOrEditMenuDialogTitle.value === '复制菜单') {
    result = await addMenu(addOrEditMenuFormData)
  } else if (addOrEditMenuDialogTitle.value === '创建子菜单') {
    result = await addMenu(addOrEditMenuFormData)
  } else {
    return
  }

  if (result.code === 200) {
    fetchMenuList()
    addOrEditMenuDialogVisible.value = false
  }
}

/**
 * @description 删除菜单
 * @param {StudyJavaSysMenuVo} row
 */
const handleClickDeleteMenu = (row: StudyJavaSysMenuVo) => {
  ElMessageBox.confirm('确认要删除吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await deleteMenu(row.menuId)
      if (result.code !== 200) return
      fetchMenuList()
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

onMounted(() => {
  fetchMenuList()
})
</script>

<style lang="scss" scoped>
.system-menu-container {
  position: relative;
}
</style>
