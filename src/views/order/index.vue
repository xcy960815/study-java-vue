<template>
  <!-- 订单列表 -->
  <div class="order-list-container h-full w-full relative">
    <el-form :model="queryFormData" label-width="auto" inline v-show="showSearch">
      <el-form-item label="订单号">
        <el-input v-model="queryFormData.orderNo" placeholder="订单号" @change="getOrderList" />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="queryFormData.userId" placeholder="用户ID" @change="getOrderList" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="queryFormData.orderStatus"
          style="width: 200px"
          placeholder="订单状态"
          @change="getOrderList"
        >
          <el-option label="待支付" :value="0" />
          <el-option label="已支付" :value="1" />
          <el-option label="配货完成" :value="2" />
          <el-option label="出库成功" :value="3" />
          <el-option label="交易成功" :value="4" />
          <el-option label="手动关闭" :value="-1" />
          <el-option label="超时关闭" :value="-2" />
          <el-option label="商家关闭" :value="-3" />
        </el-select>
      </el-form-item>
    </el-form>
    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getOrderList">
      <el-button size="small" type="primary" @click="handleClickAddOrder"> 新增订单 </el-button>
    </Handle-ToolBar>

    <el-table border :data="orderInfo.tableData" style="width: 100%">
      <el-table-column prop="orderId" label="订单ID" width="100" />
      <el-table-column prop="orderNo" label="订单号" width="150" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="totalPrice" label="总价" width="100" />
      <el-table-column prop="payStatus" label="支付状态" />
      <el-table-column prop="payType" label="支付方式" />
      <el-table-column prop="payTime" label="支付时间" />
      <el-table-column prop="orderStatus" label="订单状态" />
      <el-table-column prop="userName" label="收货人" />
      <el-table-column prop="userPhone" label="手机号" />
      <el-table-column prop="userAddress" label="收货地址" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickEditOrder(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="handleClickDeleteOrder(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="orderInfo.pageNum"
      v-model:page-size="orderInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderInfo.total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
    />

    <!-- 新增或编辑订单 -->
    <el-dialog v-model="addOrEditOrderDialogVisible" :title="addOrEditOrderDialogTitle">
      <el-form
        ref="addOrEditOrderFormRef"
        :model="addOrEditOrderFormData"
        :rules="addOrEditOrderFormRules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="addOrEditOrderFormData.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
          <el-input v-model="addOrEditOrderFormData.totalPrice" placeholder="请输入订单总价" />
        </el-form-item>
        <el-form-item label="支付状态" prop="payStatus">
          <el-select v-model="addOrEditOrderFormData.payStatus" placeholder="请选择支付状态">
            <el-option label="未支付" :value="0" />
            <el-option label="支付成功" :value="1" />
            <el-option label="支付失败" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="addOrEditOrderFormData.payType" placeholder="请选择支付方式">
            <el-option label="无" :value="0" />
            <el-option label="支付宝" :value="1" />
            <el-option label="微信" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            v-model="addOrEditOrderFormData.payTime"
            type="datetime"
            placeholder="请选择支付时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="addOrEditOrderFormData.orderStatus" placeholder="请选择订单状态">
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="配货完成" :value="2" />
            <el-option label="出库成功" :value="3" />
            <el-option label="交易成功" :value="4" />
            <el-option label="手动关闭" :value="-1" />
            <el-option label="超时关闭" :value="-2" />
            <el-option label="商家关闭" :value="-3" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="userName">
          <el-input v-model="addOrEditOrderFormData.userName" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="收货人手机号" prop="userPhone">
          <el-input v-model="addOrEditOrderFormData.userPhone" placeholder="请输入收货人手机号" />
        </el-form-item>
        <el-form-item label="收货人地址" prop="userAddress">
          <el-input v-model="addOrEditOrderFormData.userAddress" placeholder="请输入收货人地址" />
        </el-form-item>
        <el-form-item label="订单备注" prop="extraInfo">
          <el-input v-model="addOrEditOrderFormData.extraInfo" placeholder="请输入订单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addOrEditOrderDialogVisible = false">取消</el-button>
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
import { orderModule } from '@apis' // 你需要实现订单相关接口

interface OrderInfo {
  tableData: OrderVo[]
  total: number | undefined
  pageSize: number
  pageNum: number
}

const queryFormData = reactive<OrderDto>({
  orderNo: '',
  userId: undefined,
  orderStatus: undefined,
})

const addOrEditOrderDialogTitle = ref('')

const addOrEditOrderDialogVisible = ref(false)

const orderInfo = reactive<OrderInfo>({
  tableData: [],
  total: 0,
  pageSize: 10,
  pageNum: 1,
})

const handlePageSizeChange = (pageSize: number) => {
  orderInfo.pageSize = pageSize
  getOrderList()
}
const handlePageNumChange = (pageNum: number) => {
  orderInfo.pageNum = pageNum
  getOrderList()
}

/**
 * 获取订单列表
 */
const getOrderList = async () => {
  const result = await orderModule.getOrderList({
    ...queryFormData,
    pageSize: orderInfo.pageSize,
    pageNum: orderInfo.pageNum,
  })
  orderInfo.tableData = result.data
  orderInfo.total = result.total
}

const addOrEditOrderFormRef = ref<FormInstance>()

/**
 * 工具函数：保证值为 string 或 undefined，避免 el-date-picker 绑定 null
 */
function ensureStringOrUndefined(val: string | null | undefined): string | undefined {
  if (val === null || val === undefined || val === '') return undefined
  return String(val)
}

type OrderForm = Omit<OrderDto, 'payTime'> & {
  payTime?: string
}

const addOrEditOrderFormData = reactive<OrderForm>({
  userId: undefined,
  totalPrice: undefined,
  payStatus: undefined,
  payType: undefined,
  payTime: undefined,
  orderStatus: undefined,
  extraInfo: '',
  userName: '',
  userPhone: '',
  userAddress: '',
})
const addOrEditOrderFormRules: FormRules<OrderVo> = {
  userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  totalPrice: [{ required: true, message: '请输入订单总价', trigger: 'blur' }],
  payStatus: [{ required: true, message: '请选择支付状态', trigger: 'blur' }],
  payType: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
  payTime: [{ required: true, message: '请选择支付时间', trigger: 'blur' }],
  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  userPhone: [{ required: true, message: '请输入收货人手机号', trigger: 'blur' }],
  userAddress: [{ required: true, message: '请输入收货人地址', trigger: 'blur' }],
  extraInfo: [{ required: true, message: '请输入订单备注', trigger: 'blur' }],
}

const handleClickAddOrder = () => {
  addOrEditOrderDialogTitle.value = '新增订单'
  addOrEditOrderDialogVisible.value = true
  nextTick(() => {
    addOrEditOrderFormRef.value?.resetFields()
    addOrEditOrderFormData.payTime = undefined
  })
}

const handleClickEditOrder = (row: OrderVo) => {
  addOrEditOrderDialogTitle.value = '编辑订单'
  addOrEditOrderDialogVisible.value = true
  nextTick(() => {
    addOrEditOrderFormRef.value?.resetFields()
    Object.assign(addOrEditOrderFormData, {
      ...row,
      payTime: ensureStringOrUndefined(row.payTime),
    })
  })
}

/**
 * 新增或编辑订单
 */
const handleClickAddOrEditConfirm = async () => {
  const valid = await addOrEditOrderFormRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false)

  if (!valid) return
  let result
  if (addOrEditOrderDialogTitle.value === '新增订单') {
    result = await orderModule.insertOrder(addOrEditOrderFormData)
  } else {
    result = await orderModule.updateOrder(addOrEditOrderFormData)
  }
  if (result) {
    getOrderList()
    addOrEditOrderDialogVisible.value = false
  }
}

/**
 * 删除订单
 * @param row 订单信息
 */
const handleClickDeleteOrder = (row: OrderVo) => {
  ElMessageBox.confirm('确认要删除该订单吗?', '警告⚠️', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await orderModule.deleteOrder<boolean>(row.orderId)
      if (!result) return
      getOrderList()
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
  getOrderList()
})
</script>
