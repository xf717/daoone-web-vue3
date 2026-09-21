/** 限制浏览器请求到同源 BFF，禁止把认证上下文转发至外部地址。 */
export function assertApiPath(path: string): void {
  if (!/^\/api\/[a-zA-Z0-9/_-]+$/.test(path)) {
    throw new Error('API 路径必须是 /api/ 下的固定站内路径；查询参数通过 query 传入。')
  }
}
