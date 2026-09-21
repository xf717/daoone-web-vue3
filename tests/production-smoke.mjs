import assert from 'node:assert/strict'

// 对已经启动的本地构建执行冒烟检查，不使用真实账号或写入业务数据。
const base = process.env.SMOKE_BASE_URL || 'http://localhost:3000'
const origin = new URL(base).origin
const health = await fetch(`${base}/api/health`)
assert.equal(health.status, 200)
assert.deepEqual(await health.json(), { status: 'ok', service: 'daoone-web' })
assert.equal(health.headers.get('cache-control'), 'no-store')
assert.ok(health.headers.get('x-request-id'))

const rejected = await fetch(`${base}/api/health`, { method: 'POST', headers: { origin: 'https://untrusted.example' } })
assert.equal(rejected.status, 403)
const error = await rejected.json()
assert.equal(error.data.code, 'UNTRUSTED_ORIGIN')
assert.ok(error.data.requestId)
assert.equal(rejected.headers.get('x-request-id'), error.data.requestId)

const missingOrigin = await fetch(`${base}/api/health`, { method: 'POST' })
assert.equal(missingOrigin.status, 403)
const sameOrigin = await fetch(`${base}/api/health`, { method: 'POST', headers: { origin } })
assert.notEqual(sameOrigin.status, 403)

const home = await fetch(base)
assert.equal(home.status, 200)
assert.equal(home.headers.get('x-content-type-options'), 'nosniff')
assert.ok((await home.text()).includes('以盘为镜'))
const missing = await fetch(`${base}/not-a-real-page`, { headers: { accept: 'text/html' } })
assert.equal(missing.status, 404)
console.log('PASS: 首页、404、健康检查、请求标识、缓存策略及写请求来源边界')
