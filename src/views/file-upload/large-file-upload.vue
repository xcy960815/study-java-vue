<template>
  <div class="large-file-upload">
    <el-upload
      class="large-file-uploader"
      drag
      :http-request="handleUploadFile"
      action="#"
      :show-file-list="false"
      :before-upload="beforeUpload"
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
import { ref, nextTick } from 'vue'
import { type UploadProps, type UploadRequestOptions, ElMessage, ElProgress } from 'element-plus'
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

const progressDialogVisible = ref(false)
const chunkProgressArr = ref<number[]>([])

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 可加类型/大小校验
  return true
}

const handleUploadFile = async ({ file }: UploadRequestOptions) => {
  progressDialogVisible.value = true
  const totalChunks = Math.ceil(file.size / (10 * 1024 * 1024))
  chunkProgressArr.value = Array(totalChunks).fill(0)

  await uploadModule.uploadLargeFile(file, (chunkIndex: number, percent: number) => {
    chunkProgressArr.value[chunkIndex] = percent
  })

  // 检查所有分片都100%后再提示
  const checkAllDone = () => chunkProgressArr.value.every((p) => p === 100)
  const waitAllDone = async () => {
    while (!checkAllDone()) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
  await waitAllDone()
  progressDialogVisible.value = false
  ElMessage.success('全部分片上传完成')
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
