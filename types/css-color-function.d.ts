/**
 * 给 css-color-function 添加 typescript声明
 * @link https://zhuanlan.zhihu.com/p/58123993
 */
declare module 'css-color-function' {
  namespace CssColorFunction {
    export function convert(color: string): string
  }
  export = CssColorFunction
}
