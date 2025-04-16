module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复Bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式' },
    { value: 'refactor', name: 'refactor: 重构' },
    { value: 'test', name: 'test:     添加测试' },
    { value: 'chore', name: 'chore:    构建工具变动' }
  ],
  messages: {
    type: '选择提交类型:',
    subject: '简短描述:\n'
  }
}
