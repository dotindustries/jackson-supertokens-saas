import React from 'react'
import {AuthProvider, AuthProviderProps} from '@saas-ui/auth'
import {SaasProvider} from '@saas-ui/provider'

interface AppProviderProps {
  authService?: AuthProviderProps
}

export const AppProvider: React.FC<AppProviderProps> = ({authService, children}) => {
  return (
    <SaasProvider>
      <AuthProvider {...authService}>
          {children}
      </AuthProvider>
    </SaasProvider>
  )
}
