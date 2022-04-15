import {useAuth} from '@saas-ui/react'
import {LumenUser} from '@modules/auth/auth-service'

export const useCurrentUser = () => {
  const isLoading = false
  const { user } = useAuth()

  return {isLoading, user: user as LumenUser}
}
