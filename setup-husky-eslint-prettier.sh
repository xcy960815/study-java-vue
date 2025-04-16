#!/bin/bash

echo "🚀 使用 pnpm 安装 ESLint、Prettier、Husky、Commitlint 等工具 (修正版)..."

# 清理旧版 Husky 配置
rm -rf .husky 2>/dev/null

# 安装核心依赖（指定 ESLint 9+ 和最新 Husky）
pnpm add -D \
  eslint@latest \
  prettier \
  eslint-plugin-prettier@latest \
  eslint-config-prettier@latest \
  @vue/eslint-config-prettier@latest \
  eslint-plugin-vue@latest \
  husky@latest \
  lint-staged@latest \
  @commitlint/cli@latest \
  @commitlint/config-conventional@latest \
  commitizen@latest \
  cz-customizable@latest

# 添加配置文件（与之前相同）
cat > .prettierrc << EOF
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF

cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
}
EOF

cat > commitlint.config.js << EOF
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
EOF

cat > .cz-config.js << EOF
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
EOF

# 配置 package.json
pnpm pkg set "lint-staged.*.{js,ts,vue}"="[\"eslint --fix\", \"prettier --write\"]"
pnpm pkg set scripts.lint-staged="lint-staged"
pnpm pkg set scripts.prepare="husky install"
pnpm pkg set config.commitizen.path="cz-customizable"

# 初始化 Husky（新版方式）
pnpm husky install
pnpm husky add .husky/pre-commit "pnpm lint-staged"
pnpm husky add .husky/commit-msg "pnpm exec commitlint --edit \$1"

# 设置钩子文件权限
chmod +x .husky/*

# 其他配置
cat > .editorconfig << EOF
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
EOF

mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "vue"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "prettier.requireConfig": true
}
EOF

echo "✅ 所有配置已完成！验证步骤："
echo "1. 测试 commitlint: echo 'feat: test' | pnpm exec commitlint"
echo "2. 测试 lint-staged: touch test.js && git add test.js && pnpm lint-staged"
echo "3. 使用 npx cz 提交代码"