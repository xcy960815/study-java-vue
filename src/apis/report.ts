import { request } from '@/utils/request'

/**
 * 获取昨日经营报表数据
 */
export const getDailyReportData = async <T extends DailyReportVo>() => {
  return request.get<T, T>('/monitor/report/daily')
}
