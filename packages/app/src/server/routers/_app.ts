import trpc from '@trpc/server'
import {Context} from '@server/context'
import {userRouter} from '@server/routers/userRouter'
import {publicRouter} from '@server/routers/public'

export const appRouter = trpc
  .router<Context>()
  // .transformer(superjson)
  .merge('user.', userRouter)
  .merge('public.', publicRouter)

export type AppRouter = typeof appRouter
