<template>
  <div class="user-management">
    <el-table :data="userList">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userList = ref([
  { id: 1, username: '张三', email: 'zhangsan@example.com' },
  { id: 2, username: '李四', email: 'lisi@example.com' },
])

const handleEdit = (row: any) => {
  console.log('编辑用户:', row)
}
</script>
