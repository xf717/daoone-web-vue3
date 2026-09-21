import { defineEventHandler, getHeader, getRequestURL } from 'h3'
import { apiError } from '../utils/api-error'
import { isTrustedWriteOrigin } from '../utils/request-policy'

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/') || ['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return
  const config = useRuntimeConfig(event)
  const expectedOrigin = config.publicOrigin || (import.meta.dev ? getRequestURL(event).origin : '')
  if (!isTrustedWriteOrigin(getHeader(event, 'origin'), expectedOrigin)) {
    throw apiError(event, 403, 'UNTRUSTED_ORIGIN', '请求来源无效，请从本站重新操作。')
  }
})
