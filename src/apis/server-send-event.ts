import { request } from '@utils/request'

/**
 *
 * @returns ResponseResult
 */
export const serverSendEvent = <T extends string>(
  dom?: HTMLDivElement
) => {
  const url = '/sse/serverSendEvent'
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      responseType: 'stream',
      timeout: 100000,
      onDownloadProgress(progressEvent) {
        // console.log("progressEvent--progressEvent", progressEvent);
        if (dom)
          dom.innerHTML =
            progressEvent.event.currentTarget.responseText +
            '<br/>'
      }
    }
  )
}
