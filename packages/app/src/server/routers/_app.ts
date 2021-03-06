import * as trpc from '@trpc/server'
import {Context} from '@server/context'
import {userRouter} from '@server/routers/userRouter'
import {publicRouter} from '@server/routers/public'
import {orgRouter} from '@server/routers/orgRouter'
import {inferProcedureInput, inferProcedureOutput} from '@trpc/server'

export const appRouter = trpc
  .router<Context>()
  // .transformer(superjson)
  .merge('user.', userRouter)
  .merge('public.', publicRouter)
  .merge('org.', orgRouter)

export type AppRouter = typeof appRouter

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
  > = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter["_def"]["mutations"]
  > = inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;
