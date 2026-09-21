import { createServer, type Server } from 'node:http'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { useMemberSession } from '../server/utils/session'

let server: Server
let base: string

beforeAll(async () => {
  vi.stubGlobal('useRuntimeConfig', () => ({ sessionPassword: 'test-only-random-password-at-least-32-characters' }))
  const app = createApp()
  app.use(defineEventHandler(async (event) => {
    const session = await useMemberSession(event)
    if (event.path === '/set') await session.update({ accessToken: 'private-access-token', memberId: 'member-a' })
    if (event.path === '/clear') await session.clear()
    return { memberId: session.data.memberId ?? null }
  }))
  server = createServer(toNodeListener(app))
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Test server did not start')
  base = `http://127.0.0.1:${address.port}`
})

afterAll(async () => {
  vi.unstubAllGlobals()
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
})

describe('加密 Cookie 会话', () => {
  it('凭据不以明文进入 Cookie，且启用 HttpOnly/Secure', async () => {
    const response = await fetch(`${base}/set`)
    const cookie = response.headers.get('set-cookie')!
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Secure')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).not.toContain('private-access-token')
    const restored = await fetch(`${base}/read`, { headers: { cookie: cookie.split(';')[0]! } })
    expect(await restored.json()).toEqual({ memberId: 'member-a' })
  })
  it('不同浏览器会话不共享账号数据', async () => {
    await fetch(`${base}/set`)
    const anonymous = await fetch(`${base}/read`)
    expect(await anonymous.json()).toEqual({ memberId: null })
  })
  it('篡改 Cookie 不能获得账号数据', async () => {
    const response = await fetch(`${base}/set`)
    const pair = response.headers.get('set-cookie')!.split(';')[0]!
    const tampered = await fetch(`${base}/read`, { headers: { cookie: `${pair}tampered` } })
    expect(await tampered.json()).toEqual({ memberId: null })
  })
  it('Header 不能替代 Cookie 注入会话', async () => {
    const response = await fetch(`${base}/set`)
    const pair = response.headers.get('set-cookie')!.split(';')[0]!
    const value = pair.slice(pair.indexOf('=') + 1)
    const injected = await fetch(`${base}/read`, { headers: { 'x-__Host-daoone-session-session': value, 'x-h3-session': value } })
    expect(await injected.json()).toEqual({ memberId: null })
  })
})
