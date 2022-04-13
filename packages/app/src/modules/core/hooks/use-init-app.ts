import * as React from 'react'

import { useAuth } from '@saas-ui/react'
import {trpc} from '@modules/utils/trpc'

/**
 * Use this hook to load all required data for the app to function.
 * Like user data, feature flags, etc.
 **/
export const useInitApp = () => {
  const { isLoading, isAuthenticated, isLoggingIn, user } = useAuth()

  return {
    isInitializing:
      isLoading || isLoggingIn || (isAuthenticated && !user),
    isAuthenticated,
  }
}
