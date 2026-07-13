<template>
  <div class="order-list-container h-full w-full relative">
    <el-form v-show="showSearch" :model="queryFormData" label-width="auto" inline>
      <el-form-item label="订单号">
        <el-input v-model="queryFormData.orderNo" clearable placeholder="订单号" />
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input-number v-model="queryFormData.userId" :min="1" :controls="false" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="queryFormData.orderStatus" clearable class="!w-48">
          <el-option
            v-for="(meta, status) in ORDER_STATUS_META"
            :key="status"
            :label="meta.label"
            :value="Number(status)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getOrderList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <Handle-ToolBar v-model:showSearch="showSearch" @queryTableData="getOrderList">
      <el-button v-hasPermi="['order:add']" type="primary" @click="openPlaceOrderDialog()">
        提交订单
      </el-button>
    </Handle-ToolBar>

    <el-table v-loading="listLoading" border :data="orderInfo.tableData" style="width: 100%">
      <el-table-column align="center" prop="orderNo" label="订单号" min-width="190" />
      <el-table-column align="center" prop="userName" label="收货人" width="110" />
      <el-table-column align="center" prop="totalPrice" label="总金额" width="120">
        <template #default="{ row }">¥ {{ row.totalPrice }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付状态" width="110">
        <template #default="{ row }">
          <el-tag :type="getPayStatusMeta(row.payStatus).tagType">
            {{ getPayStatusMeta(row.payStatus).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="110">
        <template #default="{ row }">{{ getPaymentTypeLabel(row.payType) }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="110">
        <template #default="{ row }">
          <el-tag :type="getOrderStatusMeta(row.orderStatus).tagType">
            {{ getOrderStatusMeta(row.orderStatus).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" min-width="175" />
      <el-table-column v-if="showActionColumn" fixed="right" label="操作" min-width="310">
        <template #default="{ row }">
          <el-button
            v-hasPermi="['order:query']"
            link
            type="primary"
            size="small"
            @click="openOrderDetail(row.orderId)"
          >
            详情
          </el-button>
          <el-button
            v-if="row.orderStatus === 0"
            v-hasPermi="['order:edit']"
            link
            type="success"
            size="small"
            :loading="activePayOrderId === row.orderId"
            :disabled="activePayOrderId !== null"
            @click="openPayDialog(row)"
          >
            支付
          </el-button>
          <el-button
            v-for="action in getAvailableOrderActions(row.orderStatus)"
            :key="action.action"
            v-hasPermi="['order:edit']"
            link
            :type="action.type"
            size="small"
            :loading="transitioningOrderId === row.orderId"
            :disabled="transitioningOrderId !== null"
            @click="handleTransition(row, action)"
          >
            {{ action.label }}
          </el-button>
          <el-button
            v-hasPermi="['order:remove']"
            link
            type="danger"
            size="small"
            :disabled="deletingOrderId !== null"
            @click="handleDeleteOrder(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="orderInfo.pageNum"
      v-model:page-size="orderInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderInfo.total"
      @size-change="getOrderList"
      @current-change="getOrderList"
    />

    <el-dialog v-model="placeDialogVisible" title="提交订单" width="760px" destroy-on-close>
      <el-form
        ref="placeOrderFormRef"
        :model="placeOrderForm"
        :rules="placeOrderRules"
        label-width="100px"
        status-icon
      >
        <el-alert
          class="mb-4"
          type="info"
          :closable="false"
          title="商品价格仅供确认，订单总金额以后端创建订单响应为准。"
        />
        <el-form-item label="当前用户">
          <el-input :model-value="`${placeOrderForm.userId ?? '-'}（不可修改）`" disabled />
        </el-form-item>
        <el-form-item label="收货人" prop="userName">
          <el-input v-model="placeOrderForm.userName" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="placeOrderForm.userPhone" maxlength="11" />
        </el-form-item>
        <el-form-item label="收货地址" prop="userAddress">
          <el-input
            v-model="placeOrderForm.userAddress"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="选择商品" prop="items">
          <div v-loading="goodsLoading" class="checkout-goods-list">
            <el-empty
              v-if="checkoutGoods.length === 0 && !goodsLoading"
              description="暂无可购买商品"
            />
            <div v-for="item in checkoutGoods" :key="item.goodsId" class="checkout-goods-row">
              <el-checkbox v-model="item.selected" :disabled="item.stockNum <= 0">
                {{ item.goodsName }}
              </el-checkbox>
              <span class="goods-price">¥ {{ item.sellingPrice }}</span>
              <span class="goods-stock">库存 {{ item.stockNum }}</span>
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="Math.min(999, item.stockNum)"
                size="small"
                :disabled="!item.selected"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="展示合计">
          <strong>¥ {{ displayTotal }}</strong>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="placingOrder" @click="placeDialogVisible = false">取消</el-button>
        <el-button
          v-hasPermi="['order:add']"
          type="primary"
          :loading="placingOrder"
          :disabled="placingOrder"
          @click="handlePlaceOrder"
        >
          确认提交
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="payDialogVisible" title="支付订单" width="440px">
      <el-form label-width="90px">
        <el-form-item label="订单号">{{ selectedPayOrder?.orderNo }}</el-form-item>
        <el-form-item label="支付金额">¥ {{ selectedPayOrder?.totalPrice }}</el-form-item>
        <el-form-item label="支付方式">
          <el-radio-group v-model="selectedPayType" :disabled="activePayOrderId !== null">
            <el-radio :value="1">支付宝</el-radio>
            <el-radio :value="2">微信支付</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="activePayOrderId !== null" @click="payDialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="activePayOrderId !== null"
          :disabled="activePayOrderId !== null"
          @click="handlePayOrder"
        >
          确认支付
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="detailVisible" title="订单详情" size="520px">
      <div v-loading="detailLoading">
        <el-descriptions v-if="selectedOrderDetail" :column="1" border>
          <el-descriptions-item label="订单号">{{
            selectedOrderDetail.orderNo
          }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{
            selectedOrderDetail.userId
          }}</el-descriptions-item>
          <el-descriptions-item label="收货人">{{
            selectedOrderDetail.userName
          }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{
            selectedOrderDetail.userPhone
          }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">
            {{ selectedOrderDetail.userAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="总金额"
            >¥ {{ selectedOrderDetail.totalPrice }}</el-descriptions-item
          >
          <el-descriptions-item label="支付状态">
            <el-tag :type="getPayStatusMeta(selectedOrderDetail.payStatus).tagType">
              {{ getPayStatusMeta(selectedOrderDetail.payStatus).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPaymentTypeLabel(selectedOrderDetail.payType) }}
          </el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ selectedOrderDetail.payTime || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getOrderStatusMeta(selectedOrderDetail.orderStatus).tagType">
              {{ getOrderStatusMeta(selectedOrderDetail.orderStatus).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="lastTransactionNo" label="支付交易号">
            {{ lastTransactionNo }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            selectedOrderDetail.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            selectedOrderDetail.updateTime
          }}</el-descriptions-item>
        </el-descriptions>
        <el-alert
          class="mt-4"
          type="warning"
          :closable="false"
          title="后端当前未提供订单商品明细查询接口，本页不展示商品明细。"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import HandleToolBar from '@/components/handle-toolbar/index.vue'
import { goodsModule, orderModule } from '@apis'
import { useUserInfoStore } from '@store'
import { usePermission } from '@/composables/usePermission'
import { eventEmitter } from '@/utils/event-emits'
import {
  ORDER_STATUS_META,
  clearPaymentRequestId,
  consumeCheckoutDraft,
  getAvailableOrderActions,
  getOrCreatePaymentRequestId,
  getOrderStatusMeta,
  getPayStatusMeta,
  getPaymentTypeLabel,
  isOrderStateConflict,
  validatePlaceOrderRequest,
  type OrderActionMeta,
} from '@/utils/order-workflow'

interface OrderInfo {
  tableData: OrderVo[]
  total: number
  pageSize: number
  pageNum: number
}

interface CheckoutGoods extends CheckoutDraftItem {
  selected: boolean
}

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const { hasAnyPermi } = usePermission()
const showActionColumn = computed(() => hasAnyPermi(['order:query', 'order:edit', 'order:remove']))

const showSearch = ref(true)
const listLoading = ref(false)
const orderInfo = reactive<OrderInfo>({ tableData: [], total: 0, pageSize: 10, pageNum: 1 })
const queryFormData = reactive<OrderDto>({ orderNo: '', userId: undefined, orderStatus: undefined })

const getOrderList = async () => {
  if (listLoading.value) return
  listLoading.value = true
  try {
    const result = await orderModule.getOrderList({
      ...queryFormData,
      pageSize: orderInfo.pageSize,
      pageNum: orderInfo.pageNum,
    })
    orderInfo.tableData = result.data
    orderInfo.total = result.total
  } finally {
    listLoading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryFormData, { orderNo: '', userId: undefined, orderStatus: undefined })
  orderInfo.pageNum = 1
  getOrderList()
}

const placeDialogVisible = ref(false)
const placingOrder = ref(false)
const goodsLoading = ref(false)
const placeOrderFormRef = ref<FormInstance>()
const checkoutGoods = ref<CheckoutGoods[]>([])
const placeOrderForm = reactive<PlaceOrderRequest>({
  userId: 0,
  userName: '',
  userPhone: '',
  userAddress: '',
  items: [],
})

const selectedCheckoutItems = computed(() => checkoutGoods.value.filter((item) => item.selected))
const displayTotal = computed(() =>
  selectedCheckoutItems.value.reduce((total, item) => total + item.sellingPrice * item.quantity, 0)
)

const validateOrderItems = (_rule: unknown, _value: unknown, callback: (error?: Error) => void) => {
  const items = selectedCheckoutItems.value
  if (items.length === 0) return callback(new Error('请至少选择一个商品'))
  if (items.length > 50) return callback(new Error('一个订单最多包含50种商品'))
  if (items.some((item) => item.quantity < 1 || item.quantity > 999)) {
    return callback(new Error('单个商品数量必须为1到999'))
  }
  callback()
}

const placeOrderRules: FormRules<PlaceOrderRequest> = {
  userName: [
    { required: true, whitespace: true, message: '请输入收货人姓名', trigger: 'blur' },
    { max: 30, message: '收货人姓名不能超过30个字符', trigger: 'blur' },
  ],
  userPhone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '手机号必须是11位数字', trigger: 'blur' },
  ],
  userAddress: [
    { required: true, whitespace: true, message: '请输入收货地址', trigger: 'blur' },
    { max: 100, message: '收货地址不能超过100个字符', trigger: 'blur' },
  ],
  items: [{ validator: validateOrderItems, trigger: 'change' }],
}

const loadAvailableGoods = async () => {
  goodsLoading.value = true
  try {
    const result = await goodsModule.getGoodsList({ pageNum: 1, pageSize: 100, goodsSellStatus: 1 })
    checkoutGoods.value = result.data.map((goods) => ({
      goodsId: goods.goodsId,
      goodsName: goods.goodsName,
      sellingPrice: goods.sellingPrice,
      stockNum: goods.stockNum,
      quantity: 1,
      selected: false,
    }))
  } finally {
    goodsLoading.value = false
  }
}

const resetPlaceOrderForm = () => {
  const loginName = userInfoStore.getLoginName
  Object.assign(placeOrderForm, {
    userId: userInfoStore.getId ?? 0,
    userName: userInfoStore.getNickName || '',
    userPhone: /^\d{11}$/.test(loginName) ? loginName : '',
    userAddress: userInfoStore.getAddress || '',
    items: [],
  })
}

const openPlaceOrderDialog = async (draftItems: CheckoutDraftItem[] = []) => {
  resetPlaceOrderForm()
  placeDialogVisible.value = true
  await nextTick()
  placeOrderFormRef.value?.clearValidate()
  if (draftItems.length > 0) {
    checkoutGoods.value = draftItems.map((item) => ({ ...item, selected: true }))
  } else {
    await loadAvailableGoods()
  }
}

const handlePlaceOrder = async () => {
  if (placingOrder.value) return
  placingOrder.value = true
  try {
    const valid = await placeOrderFormRef.value?.validate().catch(() => false)
    if (!valid || !userInfoStore.getId) return
    const request: PlaceOrderRequest = {
      userId: userInfoStore.getId,
      userName: placeOrderForm.userName.trim(),
      userPhone: placeOrderForm.userPhone,
      userAddress: placeOrderForm.userAddress.trim(),
      items: selectedCheckoutItems.value.map(({ goodsId, quantity }) => ({ goodsId, quantity })),
    }
    const validationMessage = validatePlaceOrderRequest(request)
    if (validationMessage) {
      ElMessage.warning(validationMessage)
      return
    }
    const order = await orderModule.placeOrder(request)
    placeDialogVisible.value = false
    ElMessage.success(`订单 ${order.orderNo} 创建成功，后端确认金额 ¥ ${order.totalPrice}`)
    await getOrderList()
    await openOrderDetail(order.orderId)
  } finally {
    placingOrder.value = false
  }
}

const payDialogVisible = ref(false)
const selectedPayOrder = ref<OrderVo | null>(null)
const selectedPayType = ref<PaymentType>(2)
const activePayOrderId = ref<number | null>(null)

const openPayDialog = (order: OrderVo) => {
  if (activePayOrderId.value !== null || payDialogVisible.value) return
  selectedPayOrder.value = order
  selectedPayType.value = 2
  payDialogVisible.value = true
}

const transactionNumbers = reactive<Record<number, string>>({})
const lastTransactionNo = computed(() =>
  selectedOrderDetail.value ? transactionNumbers[selectedOrderDetail.value.orderId] : ''
)

const handlePayOrder = async () => {
  const order = selectedPayOrder.value
  if (!order || activePayOrderId.value !== null) return
  const payType = selectedPayType.value
  activePayOrderId.value = order.orderId
  const requestId = getOrCreatePaymentRequestId(order.orderId, payType)
  try {
    const result = await orderModule.payOrder({ requestId, orderId: order.orderId, payType })
    clearPaymentRequestId(order.orderId, payType)
    transactionNumbers[order.orderId] = result.transactionNo
    payDialogVisible.value = false
    ElMessage.success(
      result.idempotent
        ? `该订单已经支付，本次返回原支付结果：${result.transactionNo}`
        : `支付成功，交易号：${result.transactionNo}`
    )
    await refreshOrder(order.orderId)
  } catch (error) {
    if (isOrderStateConflict(error)) await refreshOrder(order.orderId)
  } finally {
    activePayOrderId.value = null
  }
}

const transitioningOrderId = ref<number | null>(null)
const handleTransition = async (order: OrderVo, action: OrderActionMeta) => {
  if (transitioningOrderId.value !== null) return
  transitioningOrderId.value = order.orderId
  try {
    await ElMessageBox.confirm(action.confirmMessage, '订单状态确认', { type: 'warning' })
  } catch {
    transitioningOrderId.value = null
    return
  }
  try {
    await orderModule.transitionOrder({ orderId: order.orderId, action: action.action })
    ElMessage.success(`${action.label}操作成功`)
    await refreshOrder(order.orderId)
  } catch (error) {
    if (isOrderStateConflict(error)) await refreshOrder(order.orderId)
  } finally {
    transitioningOrderId.value = null
  }
}

const detailVisible = ref(false)
const detailLoading = ref(false)
const selectedOrderDetail = ref<OrderVo | null>(null)
const openOrderDetail = async (orderId: number) => {
  detailVisible.value = true
  detailLoading.value = true
  try {
    selectedOrderDetail.value = await orderModule.getOrderInfo(orderId)
  } finally {
    detailLoading.value = false
  }
}

const refreshOrder = async (orderId: number) => {
  await getOrderList()
  if (detailVisible.value && selectedOrderDetail.value?.orderId === orderId) {
    await openOrderDetail(orderId)
  }
}

const deletingOrderId = ref<number | null>(null)
const handleDeleteOrder = async (order: OrderVo) => {
  if (deletingOrderId.value !== null) return
  deletingOrderId.value = order.orderId
  try {
    await ElMessageBox.confirm(`确认删除订单 ${order.orderNo} 吗？`, '警告', { type: 'warning' })
  } catch {
    deletingOrderId.value = null
    return
  }
  try {
    await orderModule.deleteOrder(order.orderId)
    ElMessage.success('删除成功')
    await getOrderList()
  } finally {
    deletingOrderId.value = null
  }
}

const handleOrderPaid = (event: OrderPaidEvent) => {
  transactionNumbers[event.orderId] = event.transactionNo
  void refreshOrder(event.orderId)
}

onMounted(async () => {
  eventEmitter.on('order-paid', handleOrderPaid)
  await getOrderList()
  if (route.query.checkout === '1') {
    const draft = consumeCheckoutDraft()
    await router.replace({ path: route.path, query: {} })
    if (draft.length > 0) await openPlaceOrderDialog(draft)
  }
})

onBeforeUnmount(() => eventEmitter.off('order-paid', handleOrderPaid))
</script>

<style scoped>
.checkout-goods-list {
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 8px 12px;
}

.checkout-goods-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 90px 90px 130px;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.checkout-goods-row:last-child {
  border-bottom: 0;
}

.goods-price {
  color: var(--el-color-danger);
}

.goods-stock {
  color: var(--el-text-color-secondary);
}
</style>
