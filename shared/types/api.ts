export interface ApiErrorData {
  code: string
  message: string
  requestId?: string
}

export interface HealthResponse {
  status: 'ok'
  service: 'daoone-web'
}
