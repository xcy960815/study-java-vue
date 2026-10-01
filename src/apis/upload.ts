import { type UploadRawFile } from 'element-plus'
import { type AxiosProgressEvent } from 'axios'
import { request } from '@utils/request'

type OnUploadProgress = (progressEvent: AxiosProgressEvent) => void

const CHUNK_SIZE = 10 * 1024 * 1024 // 10 MB 每片

export interface UploadResult {
  filePath?: string
  status: string
  message?: string
}

export const uploadFile = (formData: FormData, onUploadProgress: OnUploadProgress) => {
  return request.post<UploadResult, UploadResult>('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // 显示上传进度
    onUploadProgress,
  })
}

/** 按 10MB 分片上传，进度是各分片完成比例的平均值 */
export const uploadLargeFile = async (
  file: UploadRawFile,
  onProgress: (percent: number) => void
) => {
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))
  const chunkPercents = Array.from({ length: totalChunks }, () => 0)

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const chunk = file.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE)
    const formData = new FormData()
    formData.append('file', chunk, file.name)
    formData.append('fileName', file.name)
    formData.append('chunkIndex', String(chunkIndex))
    formData.append('totalChunks', String(totalChunks))

    const result = await request.post<UploadResult, UploadResult>('/file/upload/chunk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) {
          return
        }
        chunkPercents[chunkIndex] = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        const average = chunkPercents.reduce((sum, percent) => sum + percent, 0) / totalChunks
        onProgress(Math.round(average))
      },
    })

    if (result.status === 'error') {
      throw new Error(result.message || '分片上传失败')
    }
  }
}
