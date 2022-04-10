export const getAuthBaseUrl = () => {
  // we have to return full path incl. port otherwise auth-service freaks out when using new URL(getAuthBaseUrl())
  // if (typeof window !== 'undefined' || process.browser) return '/api/auth' // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/auth` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}/api/auth` // dev SSR should use localhost
}
