import {createProtectedRouter} from '@server/createProtectedRouter'
import {z} from 'zod'

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
      resource: z.string().nullish()
    }),
    resolve({ctx}) {
      // todo implement permission check
      return false
    }
  })
