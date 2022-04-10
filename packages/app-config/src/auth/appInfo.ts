export const samlProduct = 'supertokens'

export const appInfo = {
  appName: 'SAML Jackson + SuperTokens + SaaS-UI',
  apiBasePath: '/api/auth',
  apiDomain: getApiDomain(),
  websiteDomain: getWebsiteDomain(),
  websiteBasePath: "/auth"
}

export function getApiDomain() {
  return `http://localhost:3000`
}

export function getWebsiteDomain() {
  return `http://localhost:3000`
}
