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
    <!-- 分片进度条 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="分片上传进度"
      :close-on-click-modal="false"
      :show-close="false"
      width="400px"
    >
      <div v-for="(percent, idx) in chunkProgressArr" :key="idx" style="margin-bottom: 12px">
        <div>分片 {{ idx + 1 }}</div>
        <el-progress :percentage="percent" :color="progressColors" :show-text="true" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { type UploadProps, type UploadRequestOptions, ElMessage, ElProgress } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadModule } from '@apis'

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const progressDialogVisible = ref(false)
/**
 * @description 分片进度条
 */
const chunkProgressArr = ref<number[]>([])

/**
 * @description 上传文件前
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => true

/**
 * @description 上传文件
 */
const handleUploadFile = async ({ file }: UploadRequestOptions) => {
  progressDialogVisible.value = true
  chunkProgressArr.value = []

  // 先获取总分片数
  const totalChunks = Math.ceil(file.size / (10 * 1024 * 1024))
  chunkProgressArr.value = Array(totalChunks).fill(0)

  await uploadModule.uploadLargeFile(file, (chunkIndex, percent) => {
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

<style lang="less">
.file-uploader_messageBox {
  .el-message-box__content {
    .el-message-box__container {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<style lang="less" scoped>
:deep(.file-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.file-uploader .el-upload):hover {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.file-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
