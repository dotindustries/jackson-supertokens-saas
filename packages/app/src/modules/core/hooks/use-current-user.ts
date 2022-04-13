import {useAuth} from '@saas-ui/react'
import {LumenUser} from '@modules/auth/auth-service'

export const useCurrentUser = () => {
  const { user } = useAuth()

  return user as LumenUser
}
