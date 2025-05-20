import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

// 扫描目录函数
const scanDirectory = (dir: string, basePath: string = '') => {
  interface FileNode {
    label: string
    value: string
    isDirectory: boolean
    children?: FileNode[]
  }
  const result: Array<FileNode> = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const relativePath = path.join(basePath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      const children = scanDirectory(filePath, relativePath)
      result.push({
        label: file,
        value: relativePath,
        isDirectory: true,
        children,
      })
    } else {
      result.push({
        label: file,
        value: relativePath,
        isDirectory: false,
      })
    }
  })

  return result
}

// 文件结构生成插件
export const fileStructurePlugin = () => {
  return {
    name: 'file-structure-plugin',
    buildStart() {
      const srcPath = path.resolve(process.cwd(), 'src')
      const fileStructure = scanDirectory(srcPath)
      const outputPath = path.resolve(process.cwd(), 'public/file-structure.json')
      fs.writeFileSync(outputPath, JSON.stringify(fileStructure, null, 2))
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        '/api/project/file-structure',
        (req: IncomingMessage, res: ServerResponse) => {
          const srcPath = path.resolve(process.cwd(), 'src')
          const fileStructure = scanDirectory(srcPath)
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              code: 200,
              data: fileStructure,
            })
          )
        }
      )
    },
  }
}
