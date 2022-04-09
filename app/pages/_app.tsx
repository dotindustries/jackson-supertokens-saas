import '../styles/globals.css'
import type {AppProps} from 'next/app'
import SuperTokensReact from 'supertokens-auth-react'
import {frontendConfig} from '../config/frontendConfig'
import {AppProvider} from '../components/app'
import {createSupertokensAuthService} from '../components/auth-service'

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig())
}

function MyApp({Component, pageProps}: AppProps) {
  return (
    <AppProvider authService={createSupertokensAuthService()}>
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default MyApp
