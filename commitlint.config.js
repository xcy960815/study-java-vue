module.exports = {
  extends: ["@commitlint/config-conventional"],
  // 以下是我们自定义的规则
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build", // 构建相关
        "chore", // 辅助工具的变动
        "ci", // 自动化构建
        "docs", // 文档（documentation）
        "bug", // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        "feat", // 新功能（feature）
        "fix", // 修补bug
        "style", // 格式（不影响代码运行的变动）
        "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
        "test", // 增加测试
        "revert", // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        "types", // 定义规则
      ],
    ],
  },
};
