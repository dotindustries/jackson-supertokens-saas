import {createContext} from 'react'
import {LocalStorage} from 'ttl-localstorage'
import {defaultPermissionBehavior, permissionCacheTTL} from '@app/config/auth'

export type Permission = string

type PermissionContextType = {
  isAllowedTo: (permission: Permission) => Promise<boolean>
}

// Default behavior for the permission provider context
// i.e. if for whatever reason the consumer is used outside of a provider
// The permission will be denied if no provider says otherwise
const defaultBehavior: PermissionContextType = {
  isAllowedTo: () => defaultPermissionBehavior
}

export const PermissionContext = createContext<PermissionContextType>(defaultBehavior)

interface PermissionsProps {
  fetchPermission: (p: Permission) => Promise<boolean>
}

export const PermissionProvider: React.FC<PermissionsProps> = ({fetchPermission, children}) => {
  const cache = LocalStorage

  // Creates a method that returns cached permissions otherwise fetches from remote then caches and returns
  const isAllowedTo = async (permission: Permission) => {
    if (cache.keyExists(permission)) {
      return cache[permission]
    }
    const isAllowed = await fetchPermission(permission)
    cache.put(permission, isAllowed, permissionCacheTTL)
    return isAllowed
  }

  return <PermissionContext.Provider value={{isAllowedTo}}>{children}</PermissionContext.Provider>
}

export default PermissionProvider
