import {AuthOptions, AuthParams, AuthProviderProps, AuthStateChangeCallback, AuthToken, User} from '@saas-ui/auth'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import Session from 'supertokens-auth-react/recipe/session'

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
}): AuthProviderProps => ({
  onGetToken: async (): Promise<AuthToken> => {
    console.log('onGetToken called')
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
        accessTokenPayload: await client.sessionRecipe.getAccessTokenPayloadSecurely(),
      }
    } else {
      return null
    }
  },
  onLogin(params: AuthParams, options: AuthOptions | undefined): Promise<User | undefined | null> {
    console.log('onLogin called', params, options)
    return Promise.resolve(undefined)
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
