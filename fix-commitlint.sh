#!/bin/bash

# 清理旧配置
rm -rf .husky 2>/dev/null
rm -f commitlint.config.js

# 安装依赖（确保 commitlint 最新）
pnpm add -D @commitlint/cli@latest @commitlint/config-conventional@latest

# 生成 CommonJS 格式的配置文件
cat > commitlint.config.cjs << EOF
/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ]
  }
}
EOF

# 重新初始化 Husky
pnpm husky install
pnpm husky add .husky/commit-msg "pnpm exec commitlint --config commitlint.config.cjs --edit \$1"
chmod +x .husky/*

echo "✅ 修复完成！测试命令："
echo "echo 'invalid: test' | pnpm exec commitlint --config commitlint.config.cjs"