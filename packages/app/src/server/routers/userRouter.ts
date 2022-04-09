import {createProtectedRouter} from '@server/createProtectedRouter'
import {Profile} from '@server/context'

export const userRouter = createProtectedRouter()
  .query('me', {
    async resolve({ ctx }) {
      const profile = ctx.session.userDataInAccessToken.profile as Profile

      return {
        userId: ctx.session.userId,
        profile
      }
    }
  })
