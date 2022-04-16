import {createContext} from 'react'
import {LocalStorage} from 'ttl-localstorage'
import {defaultPermissionBehavior, permissionCacheTTL} from '@app/config/auth'
import type {Resource, Permission} from '@server/auth/permissions'

type PermissionContextType = {
  isAllowedTo: (permission: Permission, r?: Resource) => Promise<boolean>
}

// Default behavior for the permission provider context
// i.e. if for whatever reason the consumer is used outside of a provider
// The permission will be denied if no provider says otherwise
const defaultBehavior: PermissionContextType = {
  isAllowedTo: () => defaultPermissionBehavior
}

export const PermissionContext = createContext<PermissionContextType>(defaultBehavior)

interface PermissionsProps {
  fetchPermission: (p: Permission, r?: Resource) => Promise<boolean>
}

export const PermissionProvider: React.FC<PermissionsProps> = ({fetchPermission, children}) => {
  const cache = LocalStorage

  // Creates a method that returns cached permissions otherwise fetches from remote then caches and returns
  const isAllowedTo = async (permission: Permission, resource?: Resource) => {
    let key = permission + (resource || '')
    if (cache.keyExists(key)) {
      return cache[key]
    }
    const isAllowed = await fetchPermission(permission, resource)
    cache.put(key, isAllowed, permissionCacheTTL)
    return isAllowed
  }

  return <PermissionContext.Provider value={{isAllowedTo}}>{children}</PermissionContext.Provider>
}

export default PermissionProvider
