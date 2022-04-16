import {createReactQueryHooks} from '@trpc/react'
import type {AppRouter} from '@server/routers/_app'

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

export const getTrpcBaseUrl = () => {
  if (typeof window !== 'undefined') return '/api/trpc' // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc` // dev SSR should use localhost
}
