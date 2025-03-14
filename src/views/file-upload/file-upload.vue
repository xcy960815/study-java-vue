<template>
    <div class="file-upload">
        <!-- 普通文件上传 带上传进度 -->
        <el-upload class="file-uploader" :http-request="handleUploadFile" action="#" :show-file-list="false"
            :before-upload="beforeBeforeUpload">
            <el-icon class="file-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
    </div>
</template>

<script lang='ts' setup>
import { h, ref, nextTick, onMounted } from 'vue'
import { ElMessage, type UploadRawFile, type UploadRequestOptions, type IElMessageBox, ElMessageBox, ElProgress } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadModule } from "@apis"

/**
 * 上传前的拦截
 * @param {UploadRawFile} rawFile 上传文件
 */
const beforeBeforeUpload = (rawFile: UploadRawFile) => {
    // if (rawFile.size / 1024 / 1024 > 2) {
    //     ElMessage.error('文件大小不能超过 2MB!')
    //     return false
    // }
    return true
}

const colors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 },
]
/**
 * 上传文件
 * @param {UploadRequestOptions} options
 */
const handleUploadFile = async ({ file }: UploadRequestOptions) => {
    const progress = ref(0)
    // 创建进度条组件
    ElMessageBox({
        title: "上传进度",
        showCancelButton: false,
        showConfirmButton: false,
        showClose: false,
        customClass: "file-uploader_messageBox",
        message: () =>
            h(ElProgress, {
                type: "dashboard",
                color: colors,
                percentage: progress.value,
            }),
    })
    const formData = new FormData()
    formData.append("file", file)
    const result = await uploadModule.uploadFile(formData, async (progressEvent) => {
        const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total!)
        progress.value = percent
        await nextTick()
        if (progress.value === 100) {
            ElMessageBox.close()
        }
    })

    if (result.code === 200) {
        ElMessage.success("上传成功")
    }
}

onMounted(() => {
})
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
<style lang='less' scoped>
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