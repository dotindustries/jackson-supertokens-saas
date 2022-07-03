import { Resource } from "app/src/server/auth/permissions"

// Default TTL for permission cache entries
export const permissionCacheTTL = 60

export const defaultPermissionBehavior: Promise<boolean> = Promise.resolve(false)

export type ResourceType = 'user' | 'org'

export type OrgPermissions = 'delete' | 'invite_members'

export type Permissions = {
    org: OrgPermissions
}

export type Permission<T extends ResourceType> = T extends keyof Permissions
? Permissions[T]
: never;

export const res = <T extends ResourceType>(
    objectId: string,
    objectType: T
  ): Resource<T> => {
    return { objectId, objectType };
  };
export const permissionOf = <T extends ResourceType>(resourceType: T, permission: Permission<T>) => permission