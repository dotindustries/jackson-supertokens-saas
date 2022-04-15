import React from 'react'
import {Permission} from '@modules/core/providers/permissions'
import {usePermission} from '@modules/core/hooks/use-permission'
import {Loader} from '@saas-ui/react'
import {PermissionDenied} from '@modules/auth/components/PermissionDenied'

interface RestrictedProps {
  to?: Permission
  fallback?: JSX.Element | string
  loadingComponent?: JSX.Element | string
}

export const Restricted: React.FC<RestrictedProps> = ({
                                                        to,
                                                        fallback= to ? <PermissionDenied permission={to} /> : null,
                                                        loadingComponent= <Loader/>,
                                                        children}) => {
  if (!to) {
    return <>{children}</>
  }

  const [loading, allowed] = usePermission(to)
  if (loading) {
    return <>{loadingComponent}</>
  }
  if (allowed) {
    return <>{children}</>
  }
  return <>{fallback}</>
}
