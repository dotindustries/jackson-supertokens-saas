import * as trpc from '@trpc/server'
import {Context} from '@server/context'
import {userRouter} from '@server/routers/userRouter'
import {publicRouter} from '@server/routers/public'
import {orgRouter} from '@server/routers/orgRouter'

export const appRouter = trpc
  .router<Context>()
  // .transformer(superjson)
  .merge('user.', userRouter)
  .merge('public.', publicRouter)
  .merge('org.', orgRouter)

export type AppRouter = typeof appRouter
