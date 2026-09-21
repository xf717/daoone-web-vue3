import { describe, expect, it } from 'vitest'
import { buildBackendUrl, isTrustedWriteOrigin } from '../server/utils/request-policy'
import { assertApiPath } from '../app/utils/api-path'
import { getApiError } from '../shared/utils/api-error'

describe('BFF 请求边界', () => {
  it('保留 App API 前缀', () => {
    expect(buildBackendUrl('https://backend.example/app-api/', '/member/profile').href).toBe('https://backend.example/app-api/member/profile')
  })
  it.each(['https://evil.example', '//evil.example', '../admin', '%2e%2e/admin', 'member?token=secret', 'member#fragment', 'member\\auth'])('拒绝不安全上游路径 %s', (path) => {
    expect(() => buildBackendUrl('https://backend.example/app-api/', path)).toThrow()
  })
  it.each(['file:///etc', 'https://user:password@backend.example', 'https://backend.example?x=1'])('拒绝非法上游配置 %s', (base) => {
    expect(() => buildBackendUrl(base, 'member')).toThrow()
  })
  it('来源必须精确匹配，不接受同站子域、空来源或带路径的配置', () => {
    expect(isTrustedWriteOrigin('https://daoone.example', 'https://daoone.example')).toBe(true)
    expect(isTrustedWriteOrigin('https://evil.daoone.example', 'https://daoone.example')).toBe(false)
    expect(isTrustedWriteOrigin(undefined, 'https://daoone.example')).toBe(false)
    expect(isTrustedWriteOrigin('null', 'https://daoone.example')).toBe(false)
    expect(isTrustedWriteOrigin('https://daoone.example', 'https://daoone.example/path')).toBe(false)
  })
  it('浏览器只调用固定同源 API', () => {
    expect(() => assertApiPath('/api/member/profile')).not.toThrow()
    expect(() => assertApiPath('//evil.example')).toThrow()
    expect(() => assertApiPath('/api/../private')).toThrow()
  })
  it('只展示约定的公开错误', () => {
    expect(getApiError({ data: { data: { code: 'UNAUTHORIZED', message: '请先登录。', requestId: 'test' } } }).code).toBe('UNAUTHORIZED')
    expect(getApiError(new Error('private backend address')).message).not.toContain('private')
  })
})
