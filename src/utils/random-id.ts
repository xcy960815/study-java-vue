/**
 * 生成 UUID v4。
 *
 * `crypto.randomUUID` 只在安全上下文（HTTPS / localhost）下存在；
 * 部署环境（内网 HTTP）没有 secure context，该 API 为 undefined。
 * 统一走该工具：可用时直接使用，否则回退到 `crypto.getRandomValues`
 * （任意上下文均可用），两者皆缺时用 Math.random 兜底。
 */
export const randomId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (digit) => {
    const hasGetRandomValues =
      typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function'
    const randomByte = hasGetRandomValues
      ? crypto.getRandomValues(new Uint8Array(1))[0]
      : Math.floor(Math.random() * 256)
    const value = Number(digit) ^ (randomByte & (15 >> (Number(digit) / 4)))
    return value.toString(16)
  })
}
