import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {superTokensNextWrapper} from 'supertokens-node/nextjs'
import {verifySession} from 'supertokens-node/lib/build/recipe/session/framework/express'
import {SessionRequest} from 'supertokens-node/framework/express'
import supertokens from 'supertokens-node'
import {backendConfig} from '@app/config/auth/backendConfig'

supertokens.init(backendConfig())

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
    session: (req as unknown as SessionRequest).session // at this point, we have a session
    // TODO add prisma
    // prisma,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
