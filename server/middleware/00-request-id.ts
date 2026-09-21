import { randomUUID } from 'node:crypto'
import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  const requestId = randomUUID()
  event.context.requestId = requestId
  setResponseHeader(event, 'X-Request-ID', requestId)
})
