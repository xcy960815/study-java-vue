<template>
  <el-dialog
    class="change-password-dialog"
    v-model="changePassworDialogVisible"
    title="修改密码"
    width="500"
  >
    <el-form
      ref="changePasswordFormRef"
      :model="changePasswordFormData"
      :rules="changePasswordFormRules"
      label-width="auto"
      class="changePassword-form"
      status-icon
    >
      <el-form-item
        label="原始密码"
        prop="originalPassword"
      >
        <el-input
          v-model="changePasswordFormData.originalPassword"
          placeholder="请输入原始密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="changePasswordFormData.newPassword"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item
        label="确认新密码"
        prop="confirmNewPasswordMd5"
      >
        <el-input
          v-model="
            changePasswordFormData.confirmNewPasswordMd5
          "
          placeholder="请确认新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="changePassworDialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="handleChangePasswordConfirm"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Md5 from 'MD5'
import { eventEmitter } from '@utils/event-emits'
import { userModule } from '@apis'
import {
  type FormInstance,
  type FormRules,
  ElMessage
} from 'element-plus'
import { ref, reactive, nextTick } from 'vue'
interface ChangePasswordFormData {
  originalPassword: string
  newPassword: string
  confirmNewPasswordMd5: string
}
const changePassworDialogVisible = ref(false)
const changePasswordFormRef = ref<FormInstance>()

const changePasswordFormData =
  reactive<ChangePasswordFormData>({
    originalPassword: '123456',
    newPassword: '12345678',
    confirmNewPasswordMd5: '12345678'
  })

const changePasswordFormRules: FormRules<ChangePasswordFormData> =
  {
    originalPassword: [
      {
        required: true,
        message: '请输入原始密码',
        trigger: 'blur'
      }
    ],

    newPassword: [
      {
        required: true,
        message: '请输入新密码',
        trigger: 'blur'
      }
    ],

    confirmNewPasswordMd5: [
      {
        required: true,
        message: '请再次输入新密码',
        trigger: 'blur'
      }
    ]
  }

/**
 * 打开dialog
 */
const openDialog = () => {
  changePassworDialogVisible.value = true
  nextTick(() => {
    changePasswordFormRef.value?.resetFields()
  })
}

/**
 * 确认修改密码
 */
const handleChangePasswordConfirm = async () => {
  const valid = await changePasswordFormRef.value
    ?.validate()
    .catch(() => false)
  if (!valid) return
  const requestParams = {
    passwordMd5: Md5(
      changePasswordFormData.originalPassword
    ),
    newPasswordMd5: Md5(changePasswordFormData.newPassword),
    confirmNewPasswordMd5: Md5(
      changePasswordFormData.confirmNewPasswordMd5
    )
  }
  const result = await userModule
    .updateUserPassword(requestParams)
    .finally(() => {
      changePassworDialogVisible.value = false
    })
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '修改密码成功'
    })
    eventEmitter.emit('logout')
  }
}

defineExpose({
  openDialog
})
</script>
<style lang="less" scoped></style>
