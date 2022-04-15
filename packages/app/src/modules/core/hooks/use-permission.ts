import {useContext, useState} from 'react'
import {Permission, PermissionContext, Resource} from '@modules/core/providers/permissions'

export const usePermission = (permission: Permission, resource?: Resource) => {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  const {isAllowedTo} = useContext(PermissionContext)

  isAllowedTo(permission, resource).then(isAllowed => {
    setLoading(false)
    setAllowed(isAllowed)
  })
  return [loading, allowed]
}
