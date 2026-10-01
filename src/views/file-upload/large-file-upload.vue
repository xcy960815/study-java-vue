<template>
  <div class="large-file-upload h-full w-full relative">
    <el-upload
      class="large-file-uploader"
      drag
      :http-request="handleUploadFile"
      action="#"
      :show-file-list="false"
    >
      <el-icon class="large-file-uploader-icon">
        <Plus />
      </el-icon>
      <div class="el-upload__text">点击或拖拽文件到此处上传</div>
    </el-upload>
    <el-progress
      v-if="progress > 0"
      :percentage="progress"
      :color="progressColors"
      class="upload-progress"
      :show-text="true"
      :stroke-width="16"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type UploadRequestOptions, ElMessage, ElProgress } from 'element-plus'
import { AxiosError } from 'axios'
import { Plus } from '@element-plus/icons-vue'
import { uploadModule } from '@apis'

const progress = ref(0)
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const handleUploadFile = async ({ file }: UploadRequestOptions) => {
  progress.value = 0
  try {
    await uploadModule.uploadLargeFile(file, (percent) => {
      progress.value = percent
    })
    progress.value = 100
    ElMessage.success('全部分片上传完成')
  } catch (error) {
    if (error instanceof Error && !(error instanceof AxiosError)) {
      ElMessage.error(error.message)
    }
    throw error
  }
}
</script>

<style lang="less" scoped>
.large-file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  // 重点：覆盖 el-upload-dragger 的样式
  :deep(.el-upload-dragger) {
    background: transparent;
    border: none;
    box-shadow: none;
    width: 100%;
    height: 100%;
    min-height: unset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .large-file-uploader {
    width: 220px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--el-border-color);
    border-radius: 8px;
    background: var(--el-bg-color-overlay);
    transition: border-color 0.3s;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }

    .large-file-uploader-icon {
      font-size: 48px;
      color: var(--el-color-primary);
      margin-bottom: 12px;
    }
    .el-upload__text {
      color: var(--el-text-color-regular);
      font-size: 16px;
      text-align: center;
    }
  }

  .upload-progress {
    margin-top: 24px;
    width: 220px;
  }
}
</style>
