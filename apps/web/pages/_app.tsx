import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import Link from 'next/link'
import SuperTokensReact from 'supertokens-auth-react'
import { NProgressNextRouter } from '@saas-ui/react'
import {frontendConfig} from '@app/config/auth/frontendConfig'
import {AppProvider} from '@modules/core/providers/app'
import {createSupertokensAuthService} from '@modules/auth/auth-service'
import {AppRouter} from '@server/routers/_app'
import {withTRPC} from '@trpc/next'
import {TRPCError} from '@trpc/server'
import {getTrpcBaseUrl} from '@modules/utils/trpc'

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig())
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric)
// }

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  const router = useRouter()
  const tenant = router.query.tenant ? (router.query.tenant as string) : null

  return (
    <AppProvider
      authService={createSupertokensAuthService()}
      linkComponent={Link}
      onError={(error, info) => console.error(error, info)}
      tenant={tenant}
      onTenantChange={(key) => {
        router.push({
          ...router,
          query: {
            ...router.query,
            tenant: key
          }
        })
      }}
      isPublic={Component.isPublic}
      layout={Component.layout}
      sidebar={pageProps.sidebar}
    >
      <NProgressNextRouter router={router} />
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default withTRPC<AppRouter>({
  config() {
    return {
      url: getTrpcBaseUrl(),
      // transformer,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: (failureCount: any, error: any) => {
              const errCode = error?.data?.code as TRPCError['code']
              if (errCode === 'NOT_FOUND') {
                return false
              }
              return failureCount < 3
            }
          }
        }
      }
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false
})(App)
