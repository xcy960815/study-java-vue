<template>
  <div class="user-info-page p-6">
    <div class="user-info-layout">
      <!-- 左侧资料卡 -->
      <div class="profile-card">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUploadAvatar"
          accept="image/jpeg,image/png"
        >
          <div class="avatar-wrapper">
            <el-avatar class="user-avatar" shape="square" :size="120" :src="userInfo.avatar">
              {{ userInfo.nickName?.charAt(0) }}
            </el-avatar>
            <div class="avatar-overlay">
              <el-icon :size="20"><Plus /></el-icon>
            </div>
          </div>
        </el-upload>

        <h3 class="profile-card__name">{{ userInfo.nickName }}</h3>
        <p class="profile-card__sign">{{ userInfo.introduceSign || '这个人很懒，什么都没有留下' }}</p>

        <el-descriptions class="profile-card__desc" :column="1" border>
          <el-descriptions-item label="登录账号">{{ userInfo.loginName }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ userInfo.address || '暂无' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 右侧编辑区 -->
      <div class="edit-card">
        <el-tabs>
          <el-tab-pane label="基本资料">
            <el-form
              ref="profileFormRef"
              :model="profileFormData"
              :rules="profileFormRules"
              label-width="80px"
              status-icon
            >
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="profileFormData.nickName" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="个性签名" prop="introduceSign">
                <el-input
                  v-model="profileFormData.introduceSign"
                  type="textarea"
                  :rows="2"
                  maxlength="100"
                  show-word-limit
                  placeholder="请输入个性签名"
                />
              </el-form-item>
              <el-form-item label="收货地址" prop="address">
                <el-input v-model="profileFormData.address" placeholder="请输入收货地址" />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-hasPermi="['system:user:edit']"
                  type="primary"
                  :loading="profileSubmitting"
                  @click="handleSaveProfile"
                >
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码">
            <ChangePasswordForm />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules, type UploadRawFile, type UploadRequestOptions } from 'element-plus'
import { userModule } from '@apis'
import { useUserInfoStore } from '@store'
import ChangePasswordForm from '@/components/change-password-form/index.vue'

const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.$state)

const AVATAR_MAX_SIZE = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/jpeg', 'image/png']

const profileFormRef = ref<FormInstance>()
const profileSubmitting = ref(false)

const profileFormData = reactive({
  nickName: '',
  introduceSign: '',
  address: '',
})

const profileFormRules: FormRules<typeof profileFormData> = {
  nickName: [
    {
      required: true,
      message: '请输入昵称',
      trigger: 'blur',
    },
  ],
}

const initProfileForm = () => {
  profileFormData.nickName = userInfo.value.nickName
  profileFormData.introduceSign = userInfo.value.introduceSign
  profileFormData.address = userInfo.value.address
}

/**
 * 校验头像文件（jpg/png 且不超过 2MB）
 */
const beforeAvatarUpload = (file: UploadRawFile) => {
  if (!AVATAR_TYPES.includes(file.type)) {
    ElMessage.error('头像仅支持 jpg / png 格式')
    return false
  }
  if (file.size > AVATAR_MAX_SIZE) {
    ElMessage.error('头像大小不能超过 2MB')
    return false
  }
  return true
}

/**
 * 上传头像并即时更新顶栏
 */
const handleUploadAvatar = async (options: UploadRequestOptions) => {
  const formData = new FormData()
  formData.append('userId', String(userInfoStore.getId))
  formData.append('file', options.file)
  const result = await userModule.updateUserAvatar<string>(formData)
  if (result) {
    userInfoStore.setAvatar(result)
    ElMessage.success('头像更新成功')
  }
}

/**
 * 保存基本资料
 */
const handleSaveProfile = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (profileSubmitting.value) return
  profileSubmitting.value = true
  try {
    const result = await userModule.updateUser({
      id: userInfoStore.getId ?? undefined,
      nickName: profileFormData.nickName,
      introduceSign: profileFormData.introduceSign,
      address: profileFormData.address,
    })
    if (result) {
      ElMessage.success('资料保存成功')
      await userInfoStore.getUserInfo()
    }
  } finally {
    profileSubmitting.value = false
  }
}

onMounted(() => {
  initProfileForm()
})
</script>

<style lang="less" scoped>
.user-info-page {
  .user-info-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .profile-card,
  .edit-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
    padding: 24px;
  }

  .profile-card {
    text-align: center;

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      cursor: pointer;

      .user-avatar {
        border: 2px solid var(--el-border-color-light);
      }

      .avatar-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .avatar-overlay {
        opacity: 1;
      }
    }

    .profile-card__name {
      margin: 16px 0 4px;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .profile-card__sign {
      margin: 0 0 20px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    .profile-card__desc {
      text-align: left;
    }
  }
}
</style>
