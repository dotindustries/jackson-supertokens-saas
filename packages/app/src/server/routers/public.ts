import { z } from 'zod'
import {createRouter} from '@server/createRouter'
import {domainSSOConfigExists} from '@server/auth'

export const publicRouter = createRouter()
  .query('ssoConfigExists', {
    input: z.object({
      domain: z.string()
    }),
    resolve({input}) {
      return domainSSOConfigExists(input.domain)
    }
  })
