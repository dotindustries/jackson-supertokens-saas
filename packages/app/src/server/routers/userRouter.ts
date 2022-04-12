import {createProtectedRouter} from '@server/createProtectedRouter'
import {Profile, TokenPayload} from '@server/context'

export const userRouter = createProtectedRouter()
  .query('me', {
    async resolve({ ctx }) {
      let currAccessTokenPayload = ctx.session!.getAccessTokenPayload();
      let profile: Profile
      if (Object.keys(currAccessTokenPayload).length === 0) {
        profile = {
          id: ctx.session!.getUserId(),
          email: "get e-mail",
          idp_id: 'get provider id',
          organizations: []
        }
        await ctx.session!.updateAccessTokenPayload(
          { profile, ...currAccessTokenPayload }
        );
        console.log(`updated access token payload for: ${profile.id}`)
      } else {
        profile = (currAccessTokenPayload as TokenPayload).profile
      }


      return {
        userId: profile.id,
        profile
      }
    }
  })
