import {createContext} from 'react'
import {LocalStorage} from 'ttl-localstorage'
import {defaultPermissionBehavior, Permission, permissionCacheTTL, ResourceType} from '@app/config/auth'
import { getTrpcBaseUrl, trpc } from '@modules/utils/trpc'

type PermissionContextType = {
  isAllowedTo: <T extends ResourceType>(
    resource: { objectId: string; objectType: ResourceType },
    permission: Permission<T>,
    subject: { objectId: string; objectType: ResourceType } | undefined
  ) => Promise<boolean>;
}

// Default behavior for the permission provider context
// i.e. if for whatever reason the consumer is used outside of a provider
// The permission will be denied if no provider says otherwise
const defaultBehavior: PermissionContextType = {
  isAllowedTo: () => defaultPermissionBehavior
}

export const PermissionContext = createContext<PermissionContextType>(defaultBehavior)

interface PermissionsProps {}

export const PermissionProvider: React.FC<PermissionsProps> = ({children}) => {
  const client = trpc.createClient({ url: getTrpcBaseUrl() })
  const cache = LocalStorage

  const isAllowedTo = async <T extends ResourceType>(
    resource: { objectId: string; objectType: ResourceType },
    permission: Permission<T>,
    subject: { objectId: string; objectType: ResourceType } | undefined
  ) => {
    let key = permission + (resource || '')
    if (cache.keyExists(key)) {
      return cache[key] as boolean
    }
    const isAllowed = await client.query('public.checkPermission', {
      resource,
      permission,
      subject
    })
    cache.put(key, isAllowed, permissionCacheTTL)
    return isAllowed
  }

  return <PermissionContext.Provider value={{isAllowedTo}}>{children}</PermissionContext.Provider>
}

export default PermissionProvider
