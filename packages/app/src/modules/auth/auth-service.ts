import {AuthOptions, AuthParams, AuthProviderProps, AuthToken, User} from '@saas-ui/auth'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import Session from 'supertokens-auth-react/recipe/session'
import {createTRPCClient} from '@trpc/client'
import type {AppRouter} from '@server/routers/_app'

export const createSupertokensAuthService = (): AuthProviderProps => {
  return supertokens({
    authRecipe: ThirdPartyEmailPassword,
    sessionRecipe: Session
  })
}

type AuthRecipe = {
  redirectToAuth: (input: 'signin' | 'signup') => void
}

type SessionRecipe = {
  signOut: () => Promise<void>
  doesSessionExist: () => Promise<boolean>
  getAccessTokenPayloadSecurely: () => Promise<any>
  getUserId: () => Promise<string>
}

const supertokens = (client: {
  authRecipe: AuthRecipe,
  sessionRecipe: SessionRecipe
}): AuthProviderProps => {
  const trpcClient = createTRPCClient<AppRouter>({
    url: 'http://localhost:3000/api/trpc'
  })
  return ({
    onGetToken: async (): Promise<AuthToken> => {
      if (await client.sessionRecipe.doesSessionExist()) {
        const accessTokenPayload =
          await client.sessionRecipe.getAccessTokenPayloadSecurely()
        const jwtPropertyName = accessTokenPayload['_jwtPName']
        console.log('returning token', accessTokenPayload)
        return accessTokenPayload[jwtPropertyName]
      } else {
        console.log('no session')
        return undefined
      }
    },
    onLoadUser: async (): Promise<User | null> => {
      console.log('onLoadUser called')
      if (await client.sessionRecipe.doesSessionExist()) {
        return {
          id: await client.sessionRecipe.getUserId(),
          email: '',
          accessTokenPayload: await client.sessionRecipe.getAccessTokenPayloadSecurely()
        }
      } else {
        return null
      }
    },
    onLogin: async (params: AuthParams, options: AuthOptions | undefined): Promise<User | undefined | null> => {
      console.log('onLogin called', params, options)
      if (!params.email && !params.otp) {
        throw new Error(`invalid login parameters`)
      }

      if (params.otp) {
        // otp logic
      }

      if (params.email) {
        if (!params.password) {
          const tenant = params.email.split('@')[1]
          const orgExists = await Promise.race([
            trpcClient.query('public.orgExists', {domain: tenant}),
            new Promise(resolve => setTimeout(resolve, 500))
          ])
          // const orgAuthUrl = await getOrgAuthUrl(tenant)
          console.log(`found company: ${orgExists}`)
          if (!orgExists) {
            throw new Error(`not found: ${tenant}`)
          }
        }
      }
      return undefined
    },
    onLogout(options: AuthOptions | undefined): Promise<void> {
      console.log('onLogout called', options)
      return client.sessionRecipe.signOut()
    },
    onResetPassword(params: Pick<AuthParams, 'email'>, options: AuthOptions | undefined): Promise<void> {
      console.log('onResetPassword called', params, options)
      return Promise.resolve(undefined)
    },
    onSignup(params: AuthParams, options: AuthOptions | undefined): Promise<User | undefined | null> {
      console.log('onSignup called', params, options)
      return Promise.resolve(undefined)
    },
    onUpdatePassword(params: Pick<AuthParams, 'password'>, options: AuthOptions | undefined): Promise<void> {
      console.log('onUpdatePassword called', params, options)
      return Promise.resolve(undefined)
    },
    onVerifyOtp(params: AuthParams, options: AuthOptions | undefined): Promise<boolean | undefined | null> {
      console.log('onVerifyOtp called', params, options)
      return Promise.resolve(undefined)
    }
  })
}
