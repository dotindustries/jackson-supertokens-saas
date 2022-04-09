// import { z } from 'zod'
import {createRouter} from '@server/createRouter'

export const publicRouter = createRouter()
  // .mutation('magicLink', {
  //   input: z.object({
  //     email: z.string()
  //   }),
  //   resolve({ input }) {
  //     return sendMagicLink(input.email)
  //   }
  // })
