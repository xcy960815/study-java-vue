<template>
  <div class="menu-icon-wrapper">
    <el-select-v2
      filterable
      clearable
      class="menu-icon-select"
      :model-value="modelValue"
      :options="iconOptions"
      placeholder="请选择图标"
      @update:model-value="handleChange"
    >
      <template #default="{ item }">
        <div class="icon-option" style="display: flex; align-items: center">
          <icon :name="item.value" class="option-icon" />
          <span class="option-label">{{ item.label }}</span>
        </div>
      </template>
    </el-select-v2>
    <icon v-if="preIconName" :name="preIconName" class="preview-icon" />
  </div>
</template>

<script setup lang="ts">
import * as IconParkIcons from '@icon-park/vue-next'
import { ref, watch } from 'vue'

defineOptions({
  name: 'MenuIconSelector',
})

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const preIconName = ref('')

watch(
  () => props.modelValue,
  (newVal) => {
    preIconName.value = newVal
    console.log(preIconName.value)
  }
)

const iconOptions = Object.keys(IconParkIcons).map((key) => ({
  value: key,
  label: key,
}))

const handleChange = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.menu-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;

  .menu-icon-select {
    width: 240px;
  }

  .preview-icon {
    font-size: 24px;
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}

:deep(.el-select-dropdown__item > .icon-option) {
  display: flex;
  align-items: center;
  padding: 0 4px;

  .option-icon {
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  .option-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    .option-icon {
      transform: scale(1.2);
    }
  }
}
</style>
