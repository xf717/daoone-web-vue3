import { createError, type H3Event } from 'h3'

/** 统一公开错误结构；调用方不得传入上游原始异常消息。 */
export function apiError(event: H3Event, statusCode: number, code: string, message: string) {
  return createError({
    statusCode,
    statusMessage: code,
    data: { code, message, requestId: event.context.requestId },
  })
}
