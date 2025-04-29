module.exports = {
  types: [
    { value: 'feat', name: '✨ feat:     新功能' },
    { value: 'fix', name: '🐛 fix:      修复bug' },
    { value: 'docs', name: '📚 docs:     文档更新' },
    { value: 'style', name: '💎 style:    代码格式调整' },
    { value: 'refactor', name: '📦 refactor: 代码重构' },
    { value: 'perf', name: '🚀 perf:     性能优化' },
    { value: 'test', name: '🚨 test:     测试相关' },
    { value: 'build', name: '👷 build:    构建相关' },
    { value: 'ci', name: '⚙️  ci:       CI配置相关' },
    { value: 'chore', name: '♻️  chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: '🗑  revert:   回滚' },
    { value: 'wip', name: '🚧 wip:      开发中' },
  ],

  scopes: [
    { name: 'math' },
    { name: 'user' },
    { name: 'admin' },
    { name: 'system' },
    { name: 'config' },
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  messages: {
    type: '请选择提交类型:',
    scope: '请选择修改范围(可选):',
    customScope: '请输入修改范围:',
    subject: '请简要描述修改内容:\n',
    body: '请输入详细描述(可选):\n',
    breaking: '是否有破坏性更新?',
    footer: '请输入关联的issue编号(可选):\n',
    confirmCommit: '确认提交?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],
  subjectLimit: 100,
}
