import { request } from '@/utils/request'

/**
 * 获取昨日经营报表数据。
 *
 * @returns 昨日订单总数与销售总额
 */
export const getDailyReportData = async <T extends DailyReportVo>() => {
  return request.get<T, T>('/monitor/report/daily')
}
