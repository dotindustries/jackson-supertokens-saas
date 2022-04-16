import {createProtectedRouter} from '@server/createProtectedRouter'
import {z} from 'zod'
import {checkPermission, Resource, Subject} from '@server/auth/permissions'

export const userRouter = createProtectedRouter()
  .mutation('update', {
    input: z.object({
      userId: z.string(),
      name: z.string()
    }).nullish(),
    resolve({ctx}) {
      // todo implement user update
      return false
    }
  })
  .mutation('checkPermission', {
    input: z.object({
      permission: z.string(),
      resource: z.custom<Resource>().nullish(),
      subject: z.custom<Subject>().nullish()
    }),
    resolve({ctx, input: {resource, permission, subject}}) {
      if (!resource) {
        return Promise.resolve(false)
      }
      return checkPermission(
        resource,
        subject || {objectId: ctx.session.getUserId(), objectType: 'user'},
        permission
      )
    }
  })
