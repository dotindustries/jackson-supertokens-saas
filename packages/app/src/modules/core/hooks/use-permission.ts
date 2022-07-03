import {useContext, useEffect, useState} from 'react'
import {PermissionContext} from '@modules/core/providers/permissions'
import { PermissionRequirement } from '../auth/permissions';

type UsePermissionProps = {
  requirement: PermissionRequirement;
};

export const usePermission = ({ requirement }: UsePermissionProps) => {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const { resource } = requirement.resourceFn();
  const {isAllowedTo} = useContext(PermissionContext)

  useEffect(() => {
    if (!resource) {
      return
    }
    isAllowedTo(resource, requirement.permission, requirement.subject).then(isAllowed => {
      setLoading(false)
      setAllowed(isAllowed)
    })
  }, [resource])

  return [loading, allowed]
}
