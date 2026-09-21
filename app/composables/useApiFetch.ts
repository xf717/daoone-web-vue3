import { createUseFetch } from '#imports'
import { assertApiPath } from '~/utils/api-path'

/** 使用 Nuxt 官方工厂保留完整类型推断及 SSR payload；工作台可传 lazy: true。 */
export const useApiFetch = createUseFetch({
  timeout: 15000,
  retry: 0,
  onRequest({ request, options }) {
    if (typeof request !== 'string' || options.baseURL) throw new Error('页面查询仅允许同源 BFF 路径。')
    assertApiPath(request)
  },
})
