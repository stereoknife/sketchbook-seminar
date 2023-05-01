import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages'
import * as build from '@remix-run/dev/server-build'

import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'

export interface Env {
  TEST: D1Database
  TEST_DB: DrizzleD1Database
}

type Context = EventContext<Env, string, unknown>

declare module '@remix-run/server-runtime' {
  interface AppLoadContext extends Env {}
}

export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context: Context) => ({
    TEST: context.env.TEST,
    TEST_DB: drizzle(context.env.TEST)
  })
})
