import { request } from '@utils/request'

/**
 * 获取系统时间
 * @returns
 */
export const getSystemTime = <T extends string>() => {
  // const url = "/sse/getSystemTime"
  // return request.get<ResponseResult<T>, ResponseResult<T>>(url)
  // const eventSource = new EventSource('/sse/getSystemTime',{
  //     // headers: {
  //     //     'Authorization': 'Bearer ' + getToken()
  //     // }
  // });
  // eventSource.onmessage = function (event) {
  //     console.log('Received time:', event.data);
  // };
  // eventSource.onerror = function (error) {
  //     console.error('Error occurred:', error);
  // };
}
