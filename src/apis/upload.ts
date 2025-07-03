import { type UploadRawFile } from 'element-plus'
import { type AxiosProgressEvent } from 'axios'
import { request } from '@utils/request'

type OnUploadProgress = (progressEvent: AxiosProgressEvent) => void

const CHUNK_SIZE = 10 * 1024 * 1024 // 10 MB 每片

/**
 * 普通文件上传
 * @param {FormData} formData
 * @returns {Promise<ResponseResult<T>>}
 */
export const uploadFile = <T extends string>(
  formData: FormData,
  onUploadProgress: OnUploadProgress
) => {
  return request.post<ResponseResult<T>, FormData>('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // 显示上传进度
    onUploadProgress,
  })
}

/**
 * 大文件切片上传
 * @param {File} file
 * @param {(chunkIndex: number, percent: number) => void} onChunkProgress
 * @returns {Promise<void>}
 */
export const uploadLargeFile = async <T extends string>(
  file: UploadRawFile,
  onChunkProgress: (chunkIndex: number, percent: number) => void
) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('fileName', file.name)
    formData.append('chunkIndex', i.toString())
    formData.append('totalChunks', totalChunks.toString())
    await request.post(`/uploadLargeFile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total!)
        onChunkProgress(i, percent)
      },
    })
  }
}
