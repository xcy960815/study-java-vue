module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复 Bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式调整（不影响功能）' },
    { value: 'refactor', name: 'refactor: 重构（非功能、非 Bug 修复）' },
    { value: 'test', name: 'test:     添加测试' },
    { value: 'chore', name: 'chore:    构建过程、工具变更' },
    { value: 'revert', name: 'revert:   回退提交' },
    { value: 'ci', name: 'ci:       CI 配置变更' },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'build', name: 'build:    构建打包相关' },
    { value: 'feat1', name: 'feat1:    🔧 自定义类型 - 特殊功能' }, // ✅
  ],
  scopes: [],
  allowTicketNumber: false,
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入影响范围（可选）:',
    subject: '简要描述（必填）:',
    body: '详细描述（可选）:',
    footer: '关联 issue（可选）:',
    confirmCommit: '确认要提交此说明吗？',
  },
}
