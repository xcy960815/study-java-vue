<template>
  <el-form
    ref="userInfoFormRef"
    style="max-width: 600px"
    :model="userInfoFormData"
    :rules="userInfoFormRules"
    label-width="auto"
    class="user-info"
    status-icon
  >
    <el-form-item label="昵称" prop="nickName">
      <el-input v-model="userInfoFormData.nickName" placeholder="请输入用户昵称" />
    </el-form-item>
    <el-form-item label="账号" prop="loginName">
      <el-input v-model="userInfoFormData.loginName" disabled placeholder="请输入用户账号" />
    </el-form-item>
    <!-- <el-form-item label="密码" prop="passwordMd5">
      <el-input
        v-model="userInfoFormData.passwordMd5"
        placeholder="请输入用户密码"
      />
    </el-form-item> -->
    <el-form-item label="个性签名" prop="introduceSign">
      <el-input v-model="userInfoFormData.introduceSign" type="textarea" placeholder="请输入个性签名" />
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="userInfoFormData.address" type="textarea" placeholder="请输入住址" />
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="handleUploadUserAvatar"
        :show-file-list="false"
        :before-upload="handleBeforeAvatarUpload"
      >
        <img v-if="userInfoFormData.avatar" :src="userInfoFormData.avatar" class="avatar-uploader-img" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveUserInfo"> 保存 </el-button>
      <el-button @click="resetUserInfo">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, UploadRequestOptions, UploadRawFile } from 'element-plus'
import { userModule } from '@apis'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons'

const userInfoFormRef = ref<FormInstance>()
const userInfoFormData = reactive<UserInfoDto>({
  /**
   * 用户主键id
   */
  userId: null,
  /**
   * 用户昵称
   */
  nickName: '',
  /**
   * 年龄
   */
  age: 0,
  /**
   * 登陆名称(默认为手机号)
   */
  loginName: '',
  /**
   * MD5加密后的密码
   */
  passwordMd5: '',
  /**
   * 个性签名
   */
  introduceSign: '',
  /**
   * 地址
   */
  address: '',
  /**
   * 注册时间
   */
  createTime: '',
  /**
   * 头像 （base64）
   */
  avatar: ''
})

const userInfoFormRules = reactive<FormRules<Partial<UserInfoDto>>>({})

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  const result = await userModule.getUserInfo()
  if (result.code === 200) {
    Object.assign(userInfoFormData, result.data)
  }
}
/**
 * 保存用户信息
 */
const saveUserInfo = async () => {
  const valid = await userInfoFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const result = await userModule.updateUserInfo(userInfoFormData)
  if (result.code === 200) {
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
  }
}
/**
 * 上传文件之前
 * @param rawFile {UploadRawFile} 上传的文件
 * @returns {boolean}
 */
const handleBeforeAvatarUpload = (rawFile: UploadRawFile): boolean => {
  const imageType = ['image/jpeg', 'image/png', 'image/jpg']
  if (!imageType.includes(rawFile.type)) {
    ElMessage.error('上传文件必须是图片格式！')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过2MB！')
    return false
  }
  return true
}

/**
 * 上传用户头像
 * @param data {UploadRequestOptions}
 */
const handleUploadUserAvatar = async (data: UploadRequestOptions) => {
  console.log('handleUploadUserAvatar-handleUploadUserAvatar')

  const userId = userInfoFormData.userId || ''
  if (!userId) return
  const file = data.file
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId.toString())
  const result = await userModule.updateUserAvatar(formData)
  if (result.code === 200) {
    userInfoFormData.avatar = `${result.data}`
  }
}

/**
 * 重置用户信息
 */
const resetUserInfo = () => {
  userInfoFormRef.value?.resetFields()
}

onMounted(() => {
  getUserInfo()
})
</script>
<style lang="less" scoped>
.user-info {
  margin: 0 auto;

  :deep(.avatar-uploader .el-upload) {
    width: 200px;
    height: 200px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  :deep(.avatar-uploader .el-upload):hover {
    border-color: var(--el-color-primary);
  }

  :deep(.avatar-uploader .avatar-uploader-img) {
    width: 100%;
    height: 100%;
  }

  :deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
