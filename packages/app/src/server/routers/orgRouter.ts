import {z} from 'zod'
import {createProtectedRouter} from '@server/createProtectedRouter'
import * as trpc from '@trpc/server'
import {Organization} from '@server/organization'

function throwNotImplemented() {
  throw new trpc.TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred, please try again later.',
    cause: new Error('not implemented yet')
  })
}

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
        slug: input.slug,
        plan: '',
        members: []
      }
      return {organization}
    }
  })
  .mutation('create', {
    input: z.object({
      name: z.string()
    }),
    async resolve({ctx, input}) {
      throwNotImplemented()
      // todo create org
      return {organization: {id: 'id', name: input.name, slug: 'org-slug'}}
    }
  })
  .mutation('inviteMember', {
    input: z.object({
      organizationId: z.string(),
      emails: z.string().array(),
      role: z.string().nullish(),
    }),
    resolve({ctx}) {
      throwNotImplemented()
      // todo invite users
      return false
    }
  })
  .mutation('removeMember', {
    input: z.object({
      userId: z.string(),
      organizationId: z.string()
    }),
    resolve({ctx}) {
      throwNotImplemented()
      // todo remove members
      return false
    }
  })
  .mutation('update', {
    input: z.object({
      organizationId: z.string(),
      name: z.string(),
    }),
    resolve({ctx}) {
      throwNotImplemented()
      // todo update org
      return false
    }
  })
