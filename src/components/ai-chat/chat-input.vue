<template>
    <!-- 问题输入框 -->
    <div class="flex items-center">
        <div class="flex-1 question-wrapper">
            <el-input v-model="question" :autosize="{ minRows: 2 }" class="w-full h-full text-sm rounded-md"
                type="textarea" placeholder="任意问题"></el-input>
        </div>
        <div class="right-6 p-0.5 ml-5 flex items-center gap-2">
            <el-button @click="completions" title="提交" class="submit-question-button rounded-lg p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </el-button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref } from "vue"
const emits = defineEmits<{
    (event: 'completions', question: string): void
}>()
const question = ref<string>('天为什么是蓝色的？')
/**
 * 发送问题
 */
const completions = () => {
    emits('completions', question.value)
}
</script>
<style lang='less' scoped></style>