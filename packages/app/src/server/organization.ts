export interface Organization {
  id: string
  name: string
  slug: string
  plan: string
  members: Member[]
}

export interface Member {
  id: string
  email: string
  name?: string
  status?: 'invited' | 'active'
  roles?: string | string[]
  presence?: string
}
