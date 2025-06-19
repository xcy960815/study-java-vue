// 递归过滤菜单树
export const useFilterMenuTree = <R extends StudyJavaSysMenuVo>(tree: R[]): R[] => {
  return tree
    .filter((item: R) => item.menuType === 0)
    .map((item: R) => {
      const children = item.children
      if (children && children.length > 0) {
        return {
          ...item,
          value: item.id,
          children: useFilterMenuTree(children),
        }
      }
      return item
    })
}
