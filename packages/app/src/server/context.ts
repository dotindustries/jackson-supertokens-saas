import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {superTokensNextWrapper} from 'supertokens-node/nextjs'
import {verifySession} from 'supertokens-node/lib/build/recipe/session/framework/express'

interface Organization {
  id: string
  slug: string
  name: string
}

export interface Profile {
  id: string
  idp_id: string
  email: string
  company_id?: string
  organizations: Organization[]
  first_name?: string
  last_name?: string
  raw_attributes?: {
    [key: string]: any
  };
}

export interface TokenPayload {
  profile: Profile
}

export const createContext = async ({
                                      req,
                                      res
                                    }: trpcNext.CreateNextContextOptions) => {
  await superTokensNextWrapper(
    async (next) => {
      // FIXME types are not yet accepted on supertokens
      return await verifySession({sessionRequired: false})(req as any, res as any, next)
    },
    req,
    res
  )

  return {
    req,
    res,
    session: {
      // @ts-ignore
      userId: req.session?.getUserId() as string,
      // @ts-ignore
      sessionHandle: req.session?.getHandle() as string,
      // @ts-ignore
      userDataInAccessToken: req.session?.getAccessTokenPayload() as TokenPayload
    },
    // TODO add prisma
    // prisma,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
