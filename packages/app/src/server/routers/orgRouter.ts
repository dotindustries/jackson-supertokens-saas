import {z} from 'zod'
import {createProtectedRouter} from '@server/createProtectedRouter'
import * as trpc from '@trpc/server'
import {Organization} from '@server/organization'

export const orgRouter = createProtectedRouter()
  .query('get', {
    input: z.object({
      slug: z.string().nullish()
    }),
    async resolve({ctx, input}) {
      if (!input.slug) {
        return undefined
      }
      let organization: Organization = {
        id: 'someid',
        name: 'dummy-org',
        slug: input.slug
      }
      return {organization}
    }
  })
  .mutation('create', {
    input: z.object({
      name: z.string()
    }),
    async resolve({ctx, input}) {
      throw new trpc.TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred, please try again later.',
        cause: new Error('not implemented yet')
      })
      // todo create stuff
      return {organization: {id: 'id', name: input.name, slug: 'org-slug'}}
    }
  })
