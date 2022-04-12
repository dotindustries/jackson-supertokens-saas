import {createProtectedRouter} from '@server/createProtectedRouter'
import {Profile} from '@server/profile'
import {TokenPayload} from '@server/tokenPayload'

export const userRouter = createProtectedRouter()
  .query('me', {
    async resolve({ctx}) {
      let currAccessTokenPayload = ctx.session!.getAccessTokenPayload()
      let profile = (currAccessTokenPayload as TokenPayload)?.profile

      return {
        userId: profile?.id,
        profile
      }
    }
  })
