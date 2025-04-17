// lint-staged.config.js
const chalk = require('chalk')
const signale = require('signale')

module.exports = {
    renderer: {
        noTasks: () => signale.success(chalk.green('✓ 本次提交没有需要检查的文件')),
        tasks: (tasks) => {
            signale.pending(`正在检查 ${tasks.length} 类文件...`)
            return tasks
        }
    }
}