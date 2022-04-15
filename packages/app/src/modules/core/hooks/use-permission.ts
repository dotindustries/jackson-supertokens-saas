import {useContext, useState} from 'react'
import {Permission, PermissionContext} from '@modules/core/providers/permissions'

export const usePermission = (permission: Permission) => {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  const {isAllowedTo} = useContext(PermissionContext)

  isAllowedTo(permission).then(isAllowed => {
    setLoading(false)
    setAllowed(isAllowed)
  })
  return [loading, allowed]
}
