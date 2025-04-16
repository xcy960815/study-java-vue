#!/bin/bash

echo "🚀 一站式配置 ESLint + Prettier + Husky + Commitlint..."

# ------------------------- 清理旧配置 -------------------------
rm -rf .husky 2>/dev/null

# ------------------------- 安装依赖 -------------------------
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

# ------------------------- 配置文件生成 -------------------------
# Prettier 配置
cat > .prettierrc << EOF
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF

# ESLint 配置
cat > .eslintrc.cjs << EOF
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

# Commitlint 配置（增强类型校验）
cat > commitlint.config.js << EOF
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

# Commitizen 配置
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
    subject: '简短描述（必填）:\n'
  }
}
EOF

# ------------------------- 配置 package.json -------------------------
pnpm pkg set "lint-staged.*.{js,ts,vue}"="[\"eslint --fix\", \"prettier --write\"]"
pnpm pkg set scripts.lint-staged="lint-staged"
pnpm pkg set scripts.prepare="husky install"
pnpm pkg set config.commitizen.path="cz-customizable"

# ------------------------- 初始化 Husky -------------------------
pnpm husky install
pnpm husky add .husky/pre-commit "pnpm lint-staged"
pnpm husky add .husky/commit-msg "pnpm exec commitlint --edit \$1"
chmod +x .husky/*

# ------------------------- 编辑器配置 -------------------------
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

# ------------------------- 验证提示 -------------------------
echo "✅ 配置完成！请运行以下命令测试："
echo "1. 测试提交校验：echo 'invalid: test' | pnpm exec commitlint" 
echo "2. 测试 lint-staged：touch test.js && git add test.js && git commit -m 'chore: test lint-staged'"
echo "3. 使用规范提交：npx cz"