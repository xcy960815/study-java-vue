import { request } from '@/utils/request'

/**
 * 获取昨日经营报表数据
 */
export const getDailyReport = () => {
  return request({
    url: '/monitor/report/daily',
    method: 'get',
  })
}
