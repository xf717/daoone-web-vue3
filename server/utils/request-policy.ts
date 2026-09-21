/** 固定上游仅允许 HTTP(S)，路径不能改变主机、绕过 API 前缀或注入查询。 */
export function buildBackendUrl(base: string, path: string): URL {
  const url = new URL(base)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Invalid backend base URL')
  }
  if (!/^\/?[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(path)) {
    throw new Error('Invalid backend path')
  }
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  return url
}

/** 写请求仅接受配置中的站点 origin，不信任客户端提供的 Forwarded 主机。 */
export function isTrustedWriteOrigin(origin: string | undefined, expectedOrigin: string): boolean {
  if (!origin || !expectedOrigin) return false
  try {
    const expected = new URL(expectedOrigin)
    return ['http:', 'https:'].includes(expected.protocol)
      && expected.origin === expectedOrigin
      && new URL(origin).origin === origin
      && origin === expected.origin
  } catch {
    return false
  }
}
