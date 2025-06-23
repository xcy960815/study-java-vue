const ALLOW_MENU_TYPE = [0, 1] // 0: 目录, 1: 菜单

// 递归过滤菜单树
export const useFilterMenuTree = <R extends StudyJavaSysMenuVo>(tree: R[]): R[] => {
  return tree
    .filter((item: R) => ALLOW_MENU_TYPE.includes(item.menuType))
    .map((item: R) => {
      const children = item.children
      if (children && children.length > 0) {
        return {
          ...item,
          value: item.id,
          children: useFilterMenuTree(children),
        }
      }
      return {
        ...item,
        value: item.id,
      }
    })
}
