import { z } from 'zod'
import {createRouter} from '@server/createRouter'
import {domainSSOConfigExists} from '@server/auth'
import { checkPermission, Resource, Subject } from '@server/auth/permissions'
import { Permission } from '@app/config/auth'

export const publicRouter = createRouter()
  .query('ssoConfigExists', {
    input: z.object({
      domain: z.string()
    }),
    resolve({input}) {
      return domainSSOConfigExists(input.domain)
    }
  })
  .query('checkPermission', {
    input: z.object({
      resource: z.custom<Resource<any>>(),
      permission: z.custom<Permission<any>>(),
      subject: z.custom<Subject<any>>().nullish(),
    }),
    resolve({ctx, input}) {
      return checkPermission(input.resource, input.permission, input.subject)
    }
  })
