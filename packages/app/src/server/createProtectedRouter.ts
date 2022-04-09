import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { Context } from './context'

export const createProtectedRouter = () => {
  return trpc.router<Context>()
    .middleware(async ({ ctx, next }) => {
      if (!ctx.session.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return next()
    })
}
