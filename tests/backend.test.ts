import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { H3Event } from 'h3'
import { backendRequest } from '../server/utils/backend'

vi.mock('../server/utils/session', () => ({ useMemberSession: vi.fn(async () => ({ data: { accessToken: 'test-token' } })) }))
const event = { context: { requestId: 'test-request' } } as H3Event
const schema = z.object({ id: z.string() })
const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('useRuntimeConfig', () => ({ backendBaseUrl: 'https://backend.example/app-api/', backendApiTimeoutMs: 1000, memberTenantId: '7' }))
})
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

describe('后端协议适配', () => {
  it('校验并解包业务数据，保留请求标识与租户', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 0, data: { id: '123' } }))
    expect(await backendRequest(event, '/member/profile', schema, { authenticated: false })).toEqual({ id: '123' })
    const [url, options] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('https://backend.example/app-api/member/profile')
    expect(new Headers(options?.headers).get('X-Request-ID')).toBe('test-request')
    expect(new Headers(options?.headers).get('tenant-id')).toBe('7')
    expect(options?.redirect).toBe('error')
  })
  it('HTTP 200 的业务失败不能当成成功', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 1234, msg: 'secret detail' }))
    await expect(backendRequest(event, 'member/profile', schema, { authenticated: false })).rejects.toMatchObject({ statusCode: 422, data: { code: 'BUSINESS_1234' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('业务 401 转为 HTTP 401', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 401, data: null }))
    await expect(backendRequest(event, 'member/profile', schema, { authenticated: false })).rejects.toMatchObject({ statusCode: 401 })
  })
  it('拒绝契约不匹配的数据', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 0, data: { id: 123 } }))
    await expect(backendRequest(event, 'member/profile', schema, { authenticated: false })).rejects.toMatchObject({ statusCode: 502, data: { code: 'INVALID_RESPONSE' } })
  })
  it('拒绝非 JSON 响应', async () => {
    fetchMock.mockResolvedValue(new Response('<html>proxy error</html>'))
    await expect(backendRequest(event, 'member/profile', schema, { authenticated: false })).rejects.toMatchObject({ statusCode: 502 })
  })
  it('写操作网络失败不重放、不泄露上游异常', async () => {
    fetchMock.mockRejectedValue(new Error('https://private.example?token=secret'))
    await expect(backendRequest(event, 'member/records', schema, { method: 'POST', body: { name: 'test' }, authenticated: false })).rejects.toMatchObject({ statusCode: 502, data: { code: 'UPSTREAM_UNAVAILABLE', message: '服务暂时不可用，请稍后重试。' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('配置缺失时不发送请求', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ backendBaseUrl: '', backendApiTimeoutMs: 1000 }))
    await expect(backendRequest(event, 'member/profile', schema, { authenticated: false })).rejects.toMatchObject({ statusCode: 503 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
