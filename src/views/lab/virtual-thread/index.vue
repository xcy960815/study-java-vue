<template>
  <div class="vt-page p-6 space-y-4">
    <!-- 说明区 -->
    <div class="vt-card p-5">
      <h3 class="text-lg font-semibold m-0">虚拟线程吞吐基准（Java 21 LTS）</h3>
      <el-alert
        class="mt-3"
        type="info"
        show-icon
        :closable="false"
        title="同一个阻塞型负载（HTTP 类慢 IO），分别用 8 / 64 个平台线程池和「每任务一线程」的虚拟线程跑完，对比吞吐。虚拟线程阻塞时释放载体线程，吞吐可随任务数线性扩展。"
      />
    </div>

    <!-- 参数区 -->
    <div class="vt-card p-5">
      <el-form inline>
        <el-form-item label="任务总数">
          <el-input-number v-model="form.taskCount" :min="50" :max="3000" :step="100" />
        </el-form-item>
        <el-form-item label="单任务阻塞 (ms)">
          <el-input-number v-model="form.sleepMillis" :min="5" :max="50" :step="5" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-for="preset in PRESETS"
            :key="preset.label"
            class="mr-2"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </el-button>
          <el-button
            v-hasPermi="['monitor:vthread:query']"
            type="primary"
            :loading="running"
            @click="runBenchmark"
          >
            {{ running ? '基准运行中…' : '运行基准' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 结果区 -->
    <div v-if="result" class="vt-card p-5">
      <p class="text-sm text-gray-500 mt-0">
        Java {{ result.javaVersion }} · 任务 {{ result.taskCount }} × {{ result.sleepMillis }}ms 阻塞 · 全引擎总耗时 {{ result.totalElapsedMillis }} ms
      </p>
      <el-table :data="engineRows" border>
        <el-table-column label="引擎" min-width="180">
          <template #default="{ row }">
            <span class="font-medium">{{ row.label }}</span>
            <el-tag class="ml-2" type="info" size="small">{{ row.engineKey }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="并发力度" align="center" min-width="140">
          <template #default="{ row }">
            {{ row.threadType === 'VIRTUAL' ? `每任务一线程（≈${row.workerCount}）` : `${row.workerCount} 个线程` }}
          </template>
        </el-table-column>
        <el-table-column prop="wallMillis" label="总耗时 (ms)" align="center" min-width="110" />
        <el-table-column label="吞吐对比" min-width="240">
          <template #default="{ row }">
            <el-progress
              :percentage="row.throughputPercent"
              :show-text="false"
              :stroke-width="8"
              class="w-40 mr-2 inline-block align-middle"
            />
            <span class="font-medium">{{ row.throughputPerSecond.toLocaleString() }} /s</span>
          </template>
        </el-table-column>
        <el-table-column label="峰值平台线程" align="center" min-width="120">
          <template #default="{ row }">
            <el-tooltip
              content="JVM 平台线程峰值（载体线程语义），虚拟线程阻塞时不占用平台线程"
              placement="top"
            >
              <span class="text-gray-500">{{ row.peakPlatformThreads }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  type VirtualThreadBenchmarkRequest,
  type VirtualThreadBenchmarkResult,
  type VirtualThreadEngineResult,
  runVirtualThreadBenchmark,
} from '@/apis/lab'
import { usePermission } from '@/composables/usePermission'

interface PresetOption {
  label: string
  taskCount: number
  sleepMillis: number
}

interface EngineRow extends VirtualThreadEngineResult {
  /** 吞吐占最快引擎的百分比，用于进度条对比展示 */
  throughputPercent: number
}

const { hasPermi } = usePermission()

const PRESETS: PresetOption[] = [
  { label: '轻量 500 × 10ms', taskCount: 500, sleepMillis: 10 },
  { label: '默认 2000 × 20ms', taskCount: 2000, sleepMillis: 20 },
  { label: '极限 3000 × 50ms', taskCount: 3000, sleepMillis: 50 },
]

const form = ref<VirtualThreadBenchmarkRequest>({ taskCount: 2000, sleepMillis: 20 })
const running = ref(false)
const result = ref<VirtualThreadBenchmarkResult | null>(null)

const engineRows = computed<EngineRow[]>(() => {
  const engines = result.value?.engines ?? []
  const maxThroughput = Math.max(1, ...engines.map((engine) => engine.throughputPerSecond))
  return engines.map((engine) => ({
    ...engine,
    throughputPercent: Math.round((engine.throughputPerSecond / maxThroughput) * 100),
  }))
})

const applyPreset = (preset: PresetOption) => {
  form.value.taskCount = preset.taskCount
  form.value.sleepMillis = preset.sleepMillis
}

const runBenchmark = async () => {
  if (running.value) return
  if (!hasPermi(['monitor:vthread:query'])) {
    ElMessage.warning('缺少 monitor:vthread:query 权限')
    return
  }
  running.value = true
  try {
    result.value = await runVirtualThreadBenchmark(form.value)
  } catch (error) {
    // 失败提示由 request 拦截器统一弹出
  } finally {
    running.value = false
  }
}
</script>

<style lang="less" scoped>
.vt-page {
  .vt-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  }
}
</style>
