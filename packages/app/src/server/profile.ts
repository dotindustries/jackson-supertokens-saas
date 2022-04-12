import {Organization} from '@server/organization'

export interface Profile {
  id: string
  idp_id: string | undefined
  email: string
  company_id?: string
  organizations: Organization[]
  first_name?: string
  last_name?: string
  raw_attributes?: {
    [key: string]: any
  };
}
