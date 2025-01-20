<template>
  <div class="admin-user"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { adminUserModule } from '@apis'

const adminUserList = ref<Array<AdminUserInfoDto>>([])

/**
 * @description 获取用户列表
 * @returns {Promise<void>}
 */
const getAdminUserList = async () => {
  const requestParams = {
    pageSize: 10,
    pageNum: 1
  }
  const result = await adminUserModule.getAdminUserList(
    requestParams
  )
  if (result.code === 200) {
    adminUserList.value = result.data
  }
}
onMounted(() => {
  getAdminUserList()
})
</script>
<style lang="less" scoped>
.admin-user {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
