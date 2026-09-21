import { useSession, type H3Event } from 'h3'
import { apiError } from './api-error'

interface MemberSession {
  accessToken?: string
  refreshToken?: string
  accessTokenExpiresAt?: number
  memberId?: string
}

/** 创建加密签名的 HttpOnly Cookie 会话；仅供服务端认证适配使用。 */
export function useMemberSession(event: H3Event) {
  const { sessionPassword } = useRuntimeConfig(event)
  if (sessionPassword.length < 32) {
    throw apiError(event, 503, 'SESSION_NOT_CONFIGURED', '登录服务尚未配置。')
  }
  const secure = !import.meta.dev
  return useSession<MemberSession>(event, {
    name: secure ? '__Host-daoone-session' : 'daoone-session',
    password: sessionPassword,
    maxAge: 60 * 60 * 24,
    sessionHeader: false,
    cookie: { secure, httpOnly: true, sameSite: 'lax', path: '/' },
  })
}
