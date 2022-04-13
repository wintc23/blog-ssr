

import { serverCookieCache } from '@/tool'

export default function ({ req }) {
  if (process.server) {
    serverCookieCache.set(req.headers.cookie || '')
  }
}