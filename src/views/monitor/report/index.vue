<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">经营报表 (昨日数据)</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 订单总数卡片 -->
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <p class="text-gray-500 text-sm">昨日订单总数</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.totalOrders }}</p>
        </div>
      </div>

      <!-- 销售总额卡片 -->
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-4 rounded-full bg-green-100 text-green-600 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-gray-500 text-sm">昨日销售总额</p>
          <p class="text-3xl font-bold text-gray-800">¥ {{ stats.totalRevenue }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDailyReport } from '@/apis/report'

const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
})

const fetchData = async () => {
  try {
    const res = await getDailyReport()
    // ResponseEntity.ok(body) 返回的直接是 body 内容，没有 code/msg 包装
    // 除非全局拦截器做了处理。假设这里直接返回数据对象。
    if (res) {
      stats.value = res as any
    }
  } catch (error) {
    console.error('获取报表数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
