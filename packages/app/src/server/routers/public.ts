import { z } from 'zod'
import {createRouter} from '@server/createRouter'
import {getOrgAuthUrl} from '@server/auth'

export const publicRouter = createRouter()
  .mutation('orgExists', {
    input: z.object({
      domain: z.string()
    }),
    resolve({input, ctx}) {
      return getOrgAuthUrl(input.domain)
    }
  })
  // .mutation('magicLink', {
  //   input: z.object({
  //     email: z.string()
  //   }),
  //   resolve({ input }) {
  //     return sendMagicLink(input.email)
  //   }
  // })
