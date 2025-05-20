declare namespace FileTree {
  export interface FileNode {
    label: string
    value: string
    isDirectory: boolean
    children?: FileNode[]
  }
}
