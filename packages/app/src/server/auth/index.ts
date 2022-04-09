import {Profile} from '@server/context'

export interface SessionData {
  profile: Profile
}

export class OrganizationNotFound extends Error {
  constructor(m: string) {
    super(m)
  }
}

export const fetchUserOrg = async (email: string): Promise<string> => {
  // TODO check if org exists
  throw new OrganizationNotFound(`${email} has no organization attached`)
}

export const getOrgAuthUrl = (organizationID: string) => {
  const redirectURI = getRedirectURI()
  // TODO return redirectURI
  return ''
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
