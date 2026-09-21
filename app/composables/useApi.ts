import { assertApiPath } from '~/utils/api-path'

/** 用于点击、提交等主动请求；SSR 时使用当前请求上下文，禁止自动重放写操作。 */
export function useApi() {
  const requestFetch = useRequestFetch()
  return <T>(path: string, options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: Record<string, unknown>
    query?: Record<string, string | number | boolean>
    signal?: AbortSignal
  } = {}) => {
    assertApiPath(path)
    return requestFetch<T>(path, { ...options, retry: 0, timeout: 15000 })
  }
}
