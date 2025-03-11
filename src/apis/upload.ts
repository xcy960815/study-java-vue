

import { type AxiosProgressEvent } from 'axios'
import { request } from '@utils/request'


/**
 * 普通文件上传
 * @param {FormData} formData 
 * @returns {Promise<ResponseResult<T>>}
 */
export const uploadFile = <T extends string>(formData: FormData, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) => {
    return request.post<ResponseResult<T>, ResponseResult<T>>('/uploadFile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        // 显示上传进度
        onUploadProgress
    })
}

/**
 * 大文件切片上传 todo
 * @param {FormData} formData 
 * @returns 
 */
export const uploadLargeFile = (formData: FormData) => {
    return request.post('/upload/large', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}