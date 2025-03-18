<template>
    <!-- 问题输入框 & 发送按钮 -->
    <div class="flex items-center">
        <div class="flex-1 question-wrapper">
            <el-input v-model="question" :autosize="{ minRows: 2 }" class="w-full h-full text-sm rounded-md"
                type="textarea" placeholder="任意问题"></el-input>
        </div>
        <div class="right-6 p-0.5 ml-5 flex items-center gap-2">
            <el-button @keyup.enter.native="completions" @click="completions" :disabled="buttonDisabled" title="提交"
                class="submit-question-button rounded-lg p-0.5">
                <send theme="outline" size="24" fill="#333" />
                <close-one :size="buttonnConfig.size" :fill="buttonnConfig.fill" />
            </el-button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { Send } from "@icon-park/vue-next";
import { ref, computed } from "vue"

import { type Theme } from "@icon-park/vue-next/lib/runtime";
interface ButtonnConfig {
    size: number;
    fill: string;
    theme: Theme;
}
/**
 * 按钮配置
 */
const buttonnConfig: ButtonnConfig = {
    size: 14,
    fill: "#999",
    theme: "outline",
};
const emits = defineEmits<{
    (event: 'completions', question: string): void
}>()
const question = ref<string>('天为什么是蓝色的')
/**
 * 发送问题
 */
const completions = () => {
    emits('completions', question.value)
}
const buttonDisabled = computed(() => !question.value)
</script>
<style lang='less' scoped></style>