import { z } from 'zod'
import type { ApiErrorData } from '../types/api'

const errorDataSchema = z.object({
  code: z.string(),
  message: z.string(),
  requestId: z.string().optional(),
})

/** 仅展示 BFF 明确定义的公开错误，避免把内部堆栈或上游地址展示给用户。 */
export function getApiError(error: unknown): ApiErrorData {
  const envelope = z.object({ data: z.object({ data: errorDataSchema }) }).safeParse(error)
  return envelope.success
    ? envelope.data.data.data
    : { code: 'NETWORK_ERROR', message: '请求未完成，请检查网络后重试。' }
}
