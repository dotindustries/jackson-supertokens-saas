import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'

export const frontendConfig = () => ({
  appInfo,
  recipeList: [
    ThirdPartyEmailPasswordReact.init({
      preAPIHook: async (context) => {
        let url = new URL(context.url)
        let action = context.action

        if (action === 'GET_AUTHORISATION_URL') {
          // TODO check if we already have a tenant and do not overwrite
          url.searchParams.append('tenant', 'boxyhq.com')
          // TODO product should only be set here
          url.searchParams.append('product', 'supertokens')
          console.log('get_authorisation_url preAPIHook called and appended params', url)
        }

        if (action === 'THIRD_PARTY_SIGN_IN_UP') {
          // TODO check if we already have a tenant and do not overwrite
          url.searchParams.append('tenant', 'boxyhq.com')
          // TODO product should only be set here
          url.searchParams.append('product', 'supertokens')
          console.log('third_party_sign_in_up preAPIHook called and appended params', url)
        }

        return {
          requestInit: context.requestInit,
          url: url.href
        }
      },

      signInAndUpFeature: {
        providers: [
          {
            id: 'saml-jackson',
            name: 'SAML Jackson'
          }
        ]
      }
    }),
    SessionReact.init()
  ]
})
