module.exports = {
    concurrent: false,
    verbose: true,
    renderer: {
        noTasks: () => console.log('🔄 检测到没有需要处理的暂存文件'),
        tasks: (tasks) => tasks.map(task => `🔧 正在处理: ${task}`)
    }
}