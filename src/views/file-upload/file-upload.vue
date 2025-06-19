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
  </div>
</template>

<script lang="ts" setup>
import { type UploadProps, type UploadRequestOptions, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadModule } from '@apis'
/**
 * @description 上传文件前
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => true

/**
 * @description 上传文件
 */
const handleUploadFile = async ({ file }: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('file', file)
  await uploadModule.uploadFile(formData, (progressEvent) => {
    if (progressEvent.total) {
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      console.log('percent', percent)
    }
  })
  ElMessage.success('上传成功')
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
