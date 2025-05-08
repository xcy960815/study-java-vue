module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式调整
        'refactor', // 代码重构
        'perf', // 性能优化
        'test', // 测试相关
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建相关
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0],
    'subject-case': [0],
    'header-max-length': [0],
    'header-trim': [2, 'always'],
    'subject-empty': [2, 'never'],
  },
  prompt: {
    questions: {
      type: {
        description: '请选择提交类型',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '修复bug',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '文档更新',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '代码格式调整',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '代码重构',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '测试相关',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '构建相关',
            title: 'Builds',
            emoji: '👷',
          },
          ci: {
            description: 'CI配置相关',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '构建过程或辅助工具的变动',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '回滚',
            title: 'Reverts',
            emoji: '🗑',
          },
          wip: {
            description: '开发中',
            title: 'Work In Progress',
            emoji: '🚧',
          },
        },
      },
      scope: {
        description: '请输入修改范围（可选）',
      },
      subject: {
        description: '请简要描述修改内容',
      },
      body: {
        description: '请输入详细描述（可选）',
      },
      isBreaking: {
        description: '是否有破坏性更新？',
      },
      breakingBody: {
        description: '请输入破坏性更新的详细描述',
      },
      isIssueAffected: {
        description: '是否关联issue？',
      },
      issues: {
        description: '请输入关联的issue编号（可选）',
      },
    },
  },
  helpUrl:
    '请使用以下格式提交：\n' +
    '  type(scope): subject\n\n' +
    '例如：\n' +
    '  feat(math): 添加数学练习功能\n' +
    '  fix(user): 修复登录问题\n\n' +
    'type 可选值：\n' +
    '  ✨ feat:     新功能\n' +
    '  🐛 fix:      修复bug\n' +
    '  📚 docs:     文档更新\n' +
    '  💎 style:    代码格式调整\n' +
    '  📦 refactor: 代码重构\n' +
    '  🚀 perf:     性能优化\n' +
    '  🚨 test:     测试相关\n' +
    '  👷 build:    构建相关\n' +
    '  ⚙️  ci:       CI配置相关\n' +
    '  ♻️  chore:    构建过程或辅助工具的变动\n' +
    '  🗑  revert:   回滚\n' +
    '  🚧 wip:      开发中\n\n' +
    'scope 可选值：\n' +
    '  math, user, admin, system, config\n\n' +
    '或者使用 npm run commit 进行交互式提交',
}
