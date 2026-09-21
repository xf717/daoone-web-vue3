import { defineEventHandler } from 'h3'
import type { HealthResponse } from '../../shared/types/api'

// 仅表示 Nuxt 进程存活，不代表 Java、数据库或认证已联通。
export default defineEventHandler((): HealthResponse => ({ status: 'ok', service: 'daoone-web' }))
