import type { H3Event } from 'h3'
import { z } from 'zod'
import { apiError } from './api-error'
import { buildBackendUrl } from './request-policy'
import { useMemberSession } from './session'

// 业务失败允许省略 data；成功数据仍必须通过调用方的具体 Schema。
const envelopeSchema = z.object({ code: z.number(), msg: z.string().optional(), data: z.unknown().optional() })

/** 调用已确认的 App API 并校验响应；path 必须由路由实现提供，不能透传用户 URL。 */
export async function backendRequest<T>(event: H3Event, path: string, schema: z.ZodType<T>, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  query?: Record<string, string | number | boolean>
  authenticated?: boolean
} = {}): Promise<T> {
  const config = useRuntimeConfig(event)
  let url: URL
  try {
    url = buildBackendUrl(config.backendBaseUrl, path)
  } catch {
    throw apiError(event, 503, 'BACKEND_NOT_CONFIGURED', '服务尚未配置。')
  }
  const timeout = Number(config.backendApiTimeoutMs)
  if (!Number.isFinite(timeout) || timeout <= 0 || timeout > 120000) {
    throw apiError(event, 503, 'INVALID_TIMEOUT', '服务配置异常。')
  }
  for (const [key, value] of Object.entries(options.query ?? {})) url.searchParams.set(key, String(value))
  const headers = new Headers({ Accept: 'application/json', 'X-Request-ID': String(event.context.requestId ?? '') })
  if (config.memberTenantId) headers.set('tenant-id', String(config.memberTenantId))
  if (options.authenticated !== false) {
    const session = await useMemberSession(event)
    if (!session.data.accessToken) throw apiError(event, 401, 'UNAUTHORIZED', '请先登录。')
    headers.set('Authorization', `Bearer ${session.data.accessToken}`)
  }
  if (options.body) headers.set('Content-Type', 'application/json')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      redirect: 'error',
    })
    if (!response.ok) {
      const status = [401, 403, 404, 409, 422, 429].includes(response.status) ? response.status : 502
      throw apiError(event, status, `UPSTREAM_HTTP_${response.status}`, status === 401 ? '登录已过期，请重新登录。' : '服务请求未完成，请稍后重试。')
    }
    const envelope = envelopeSchema.safeParse(await response.json().catch(() => null))
    if (!envelope.success) throw apiError(event, 502, 'INVALID_RESPONSE', '服务响应格式异常。')
    if (envelope.data.code !== 0) {
      const status = envelope.data.code === 401 ? 401 : envelope.data.code === 403 ? 403 : 422
      throw apiError(event, status, `BUSINESS_${envelope.data.code}`, status === 401 ? '登录已过期，请重新登录。' : '操作未完成，请检查输入或稍后重试。')
    }
    const data = schema.safeParse(envelope.data.data)
    if (!data.success) throw apiError(event, 502, 'INVALID_RESPONSE', '服务响应格式异常。')
    return data.data
  } catch (error) {
    // 仅保留本层构造的公开错误，不转发 fetch 的 URL、响应正文或堆栈。
    if (error && typeof error === 'object' && 'statusCode' in error && 'data' in error) throw error
    throw apiError(event, controller.signal.aborted ? 504 : 502, controller.signal.aborted ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE', '服务暂时不可用，请稍后重试。')
  } finally {
    clearTimeout(timer)
  }
}
