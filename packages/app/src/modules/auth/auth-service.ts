import {AuthOptions, AuthParams, AuthProviderProps, AuthToken, User} from '@saas-ui/auth'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import Session from 'supertokens-auth-react/recipe/session'
import {createTRPCClient} from '@trpc/client'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import type {AppRouter} from '@server/routers/_app'
import {getAuthBaseUrl} from '@modules/utils/auth'
import {getTrpcBaseUrl} from '@modules/utils/trpc'
import {samlProduct} from '@app/config/auth/appInfo'
import {TokenPayload} from '@server/tokenPayload'

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
    url: getTrpcBaseUrl()
  })
  return ({
    onGetToken: async (): Promise<AuthToken> => {
      if (await client.sessionRecipe.doesSessionExist()) {
        const accessTokenPayload =
          await client.sessionRecipe.getAccessTokenPayloadSecurely()
        // IF we would ever need to return the access token, we need to expose it first in supertokens then:
        // const jwtPropertyName = accessTokenPayload['_jwtPName']
        return accessTokenPayload // accessTokenPayload[jwtPropertyName]
      } else {
        console.warn('no session')
        return undefined
      }
    },
    onLoadUser: async (): Promise<User | null> => {
      if (await client.sessionRecipe.doesSessionExist()) {
        let tokenPayload = await client.sessionRecipe.getAccessTokenPayloadSecurely()
        let payload = tokenPayload as TokenPayload
        return {
          id: await client.sessionRecipe.getUserId(),
          email: payload.profile.email,
          accessTokenPayload: tokenPayload
        }
      } else {
        return null
      }
    },
    onLogin: async (params: AuthParams, options: AuthOptions | undefined): Promise<User | undefined | null> => {
      let user: User | undefined
      if (!params.email && !params.otp) {
        throw new Error(`invalid login parameters`)
      }

      if (params.otp) {
        // otp logic??
      }

      if (params.provider) {
        // SAML and oidc logic??
      }

      // Jackson SAML logic
      if (params.email) {
        if (!params.password) {
          const domain = params.email.split('@')[1]
          const orgExists = await Promise.race([
            trpcClient.query('public.ssoConfigExists', {domain: domain}),
            new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))
          ])
          if (!orgExists) {
            throw new Error(`not found: ${domain}`)
          }
          // TODO replace with SuperTokens helper:
          // e.g  const redirect = client.authRecipe.initProviderLogin('saml-jackson')
          //   window.location.href = redirect
          // region SuperTokens provider authUrl without helper method
          const getCompanyAuthUrl = new URL(`${getAuthBaseUrl()}/authorisationurl`)
          getCompanyAuthUrl.searchParams.append('thirdPartyId', 'saml-jackson')
          getCompanyAuthUrl.searchParams.append('tenant', domain)
          getCompanyAuthUrl.searchParams.append('product', samlProduct)
          console.log(`getting auth url from: ${getCompanyAuthUrl.toString()}`)
          const response = await axios.get<{status: string, url: string}>(getCompanyAuthUrl.toString(),
            {
              headers: {
                rid: 'thirdpartyemailpassword'
              }
            }
          )
          let urlObj = new URL(response.data.url)
          urlObj.searchParams.append('redirect_uri', 'http://localhost:3000/auth/callback/saml-jackson')
          // FIXME I have to manually add state for XRSF
          //  but upon redirect SuperTokens doesn't recognize my state
          urlObj.searchParams.append('state', uuidv4())
          window.location.href = urlObj.toString()
          // endregion
        } else {
          const response = await fetch(`${getAuthBaseUrl()}/signin`, {
            method: 'POST',
            headers: {
              rid: 'thirdpartyemailpassword'
            },
            body: JSON.stringify({'formFields': [
                {
                  'id': 'email',
                  'value': params.email
                },
                {
                  'id': 'password',
                  'value': params.password
                }
              ]})
          })

          // {
          //   "status": "OK",
          //   "user": {
          //     "id": "fa7a0841-b533-4478-95533-0fde890c3483",
          //     "email": "johndoe@gmail.com",
          //     "timeJoined": 1638433545183
          //   }
          // }
          const data = await response.json()
          user = {
            id: data.user.id,
            email: data.user.email
          }
        }
      }
      // TODO check with Eelco why do we have to return the user?
      return user
    },
    onLogout(options: AuthOptions | undefined): Promise<void> {
      console.log('onLogout called', options)
      return client.sessionRecipe.signOut()
    },
    onResetPassword(params: Pick<AuthParams, 'email'>, options: AuthOptions | undefined): Promise<void> {
      console.log('onResetPassword called', params, options)
      return Promise.resolve(undefined)
    },
    async onSignup(params: AuthParams, options: AuthOptions | undefined): Promise<User | undefined | null> {
      let user: User | undefined
      console.log('onSignup called', params, options)
      const response = await axios.post(`${getAuthBaseUrl()}/signup`, {
        "formFields": [
          {
            "id": "email",
            "value": params.email
          },
          {
            "id": "password",
            "value": params.password
          }
        ]
      })
      // {
      //   "status": "OK",
      //   "user": {
      //     "id": "fa7a0841-b533-4478-95533-0fde890c3483",
      //     "email": "johndoe@gmail.com",
      //     "timeJoined": 1638433545183
      //   }
      // }
      if (response.status === 200) {
        user = {
          id: response.data.user.id,
          email: response.data.user.email
        }
      }
      return user
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
