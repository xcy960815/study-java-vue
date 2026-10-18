import { describe, expect, it } from 'vitest'

import { buildRoute } from './build-route'

/**
 * 构造最小可用的菜单 VO（component 需指向真实存在的视图组件，
 * 否则 buildRoute 内的 getComponent 会抛「组件不存在」）
 */
const makeMenu = (
  id: number,
  path: string,
  menuName: string,
  children?: StudyJavaSysMenuVo[]
): StudyJavaSysMenuVo => ({
  id,
  parentId: null,
  menuName,
  path,
  component: 'views/login/index.vue',
  icon: 'Home',
  menuType: children ? 0 : 1,
  perms: '',
  orderNum: 0,
  createTime: '2026-01-01 00:00:00',
  updateTime: '2026-01-01 00:00:00',
  children,
})

describe('buildRoute', () => {
  it('同层重复 path 的菜单只保留首行（本仓 /monitor 双目录回归）', () => {
    const routes = buildRoute([
      makeMenu(17, '/monitor', '系统监控'),
      makeMenu(18, '/monitor', 'monitor'),
    ])

    expect(routes).toHaveLength(1)
    expect(routes[0].name).toBe('Monitor')
    expect(routes[0].meta?.title).toBe('系统监控')
    expect(routes[0].meta?.icon).toBe('Home')
  })

  it('子层级重复 path 同样去重（递归生效）', () => {
    const routes = buildRoute([
      makeMenu(14, '/order', '订单', [
        makeMenu(16, '/order/list', '第一份'),
        makeMenu(99, '/order/list', '第二份'),
      ]),
    ])

    expect(routes).toHaveLength(1)
    expect(routes[0].children).toHaveLength(1)
    expect(routes[0].children?.[0].meta?.title).toBe('第一份')
  })

  it('无重复 path 时构建结果保持不变', () => {
    const routes = buildRoute([
      makeMenu(5, '/goods', '商品', [makeMenu(6, '/goods/list', '商品列表')]),
      makeMenu(14, '/order', '订单', [makeMenu(16, '/order/list', '订单列表')]),
    ])

    expect(routes).toHaveLength(2)
    expect(routes.map((route) => route.name)).toEqual(['Goods', 'Order'])
    expect(routes[0].children).toHaveLength(1)
    expect(routes[1].children).toHaveLength(1)
  })
})
