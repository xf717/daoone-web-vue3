// 框架与 UI 模块统一使用 Nuxt 4 官方目录约定。
export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ui: { fonts: false, colorMode: false },
  icon: { serverBundle: { collections: ['lucide'] }, fallbackToApi: false },
  typescript: { strict: true },
  nitro: { preset: 'node-server' },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '道一 DaoOne',
      meta: [{ name: 'description', content: '以盘为镜，不以盘定命。' }],
    },
  },
  runtimeConfig: {
    backendBaseUrl: '',
    backendApiTimeoutMs: 10000,
    memberTenantId: '',
    sessionPassword: '',
    publicOrigin: '',
    public: { appName: '道一 DaoOne' },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    '/api/**': { headers: { 'Cache-Control': 'no-store' } },
    '/workspace/**': { ssr: false, headers: { 'Cache-Control': 'no-store' } },
  },
})
