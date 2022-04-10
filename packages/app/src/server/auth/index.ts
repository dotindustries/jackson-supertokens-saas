import {Profile} from '@server/context'
import axios, {AxiosResponse} from 'axios'
import {jacksonApiUrl} from '@app/config/auth/backendConfig'
import {samlProduct} from '@app/config/auth/appInfo'

export interface SessionData {
  profile: Profile
}

export class OrganizationNotFound extends Error {
  constructor(m: string) {
    super(m)
  }
}

export interface SSL {
  publicKey: string
  privateKey: string
}

interface SSOConfig {
  postUrl: string
  redirectUrl: string
}

interface IDPMetadata {
  sso: SSOConfig
  entityID: string,
  thumbprint: string
  loginType: string
  provider: string
}

export interface SAMLTenantConfig {
  idpMetadata: IDPMetadata
  defaultRedirectUrl: string
  redirectUrl: string[]
  tenant: string
  product: string
  name: string
  description: string
  clientID: string
  clientSecret: string
  certs: SSL
}

export const getOrgAuthUrl = async (tenantDomain: string): Promise<string | undefined> => {
  const redirectURI = getRedirectURI()

  const params = encodeURI(`tenant=${tenantDomain}&product=${samlProduct}`)

  let config: AxiosResponse<SAMLTenantConfig>
  try {
    config = await axios({
      method: 'get',
      url: `${jacksonApiUrl}/api/v1/saml/config?${params}`,
      headers: {
        Authorization: `Bearer ${'access_token'}`
      }
    })
  } catch (e) {
    throw new OrganizationNotFound(tenantDomain)
  }

  return config.data.idpMetadata.sso.redirectUrl
}

export const sendMagicLink = async (email: string) => {
  const redirectURI = getRedirectURI()

  // TODO send magic link to user
}

function getRedirectURI() {
  return process.env.REDIRECT_URI
    ? `${process.env.REDIRECT_URI}`
    : process.env.VERCEL_URL
      // TODO set recipe ID on returning authenticated call
      ? `https://${process.env.VERCEL_URL}/api/auth/callback/recipeID`
      : 'http://localhost:3000/api/auth/sso/callback'
}
