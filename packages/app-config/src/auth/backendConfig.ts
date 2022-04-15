import SessionNode from 'supertokens-node/recipe/session'
import {TypeInput} from 'supertokens-node/types'
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword'
import axios from 'axios'
import {appInfo} from './appInfo'
import {Profile} from 'app/src/server/profile'

export const jacksonApiSecret = process.env.JACKSON_API_KEY
// if the app is running within docker, we need the hostnames
export const jacksonApiUrl = process.env.DOCKER ? 'http://jackson:5225' : 'http://localhost:5225'
const connectionURI = process.env.DOCKER ? 'http://supertoken:3567' : process.env.SUPERTOKENS_API_URI ?? 'http://localhost:3567'
const apiKey = process.env.SUPERTOKENS_API_KEY
const jacksonAuthUrl = 'http://localhost:5225'

export const backendConfig = (): TypeInput => {
  return {
    framework: 'express',
    supertokens: {
      connectionURI,
      apiKey
    },
    appInfo,
    recipeList: [
      ThirdPartyEmailPassword.init({
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              authorisationUrlGET: async (input) => {
                input.userContext.request = input.options.req.original
                return originalImplementation.authorisationUrlGET!(input)
              },
              thirdPartySignInUpPOST: async (input) => {
                input.userContext.request = input.options.req.original
                const ret = await originalImplementation.thirdPartySignInUpPOST!(input)
                if (ret.status === 'OK') {
                  let currAccessTokenPayload = ret.session.getAccessTokenPayload()
                  const profile: Profile = {
                    id: ret.user.id,
                    email: ret.user.email,
                    idp_id: ret.user.thirdParty?.userId,
                    organizations: []
                  }
                  await ret.session.updateAccessTokenPayload(
                    {profile, ...currAccessTokenPayload}
                  )
                }
                return ret
              },
              emailPasswordSignInPOST: async (input) => {
                const ret = await originalImplementation.emailPasswordSignInPOST!(input)
                if (ret.status === 'OK') {
                  let currAccessTokenPayload = ret.session.getAccessTokenPayload()
                  const profile: Profile = {
                    id: ret.user.id,
                    email: ret.user.email,
                    idp_id: ret.user.thirdParty?.userId,
                    organizations: []
                  }
                  await ret.session.updateAccessTokenPayload(
                    {profile, ...currAccessTokenPayload}
                  )
                }
                return ret
              }
            }
          }
        },
        providers: [
          {
            id: 'saml-jackson',
            get: (redirectURI, authCodeFromRequest, userContext) => {
              let request = userContext.request
              let tenant = request === undefined ? '' : request.query.tenant
              let product = request === undefined ? '' : request.query.product
              let client_id = encodeURI(`tenant=${tenant}&product=${product}`)
              return {
                accessTokenAPI: {
                  url: `${jacksonApiUrl}/api/oauth/token`,
                  params: {
                    client_id,
                    client_secret: 'dummy',
                    grant_type: 'authorization_code',
                    redirect_uri: redirectURI!,
                    code: authCodeFromRequest!
                  }
                },
                authorisationRedirect: {
                  url: `${jacksonAuthUrl}/api/oauth/authorize`,
                  params: {
                    client_id
                  }
                },
                getClientId: () => {
                  return client_id
                },
                getProfileInfo: async (accessTokenAPIResponse) => {
                  const profile = await axios({
                    method: 'get',
                    url: `${jacksonApiUrl}/api/oauth/userinfo`,
                    headers: {
                      Authorization: `Bearer ${accessTokenAPIResponse.access_token}`
                    }
                  })
                  const info = {
                    id: profile.data.id,
                    email: {
                      id: profile.data.email,
                      isVerified: true
                    }
                  }
                  console.log(`created profile info`, info)
                  return info
                }
              }
            }
          }
        ]
      }),
      SessionNode.init()
    ],
    isInServerlessEnv: true
  }
}
