import React from 'react'
import {Container} from '@chakra-ui/react'
import { PermissionRequirement } from '@modules/core/auth/permissions'

interface PermissionDeniedProps {
  permission: PermissionRequirement
}

export const PermissionDenied = ({permission}: PermissionDeniedProps) => {
  return (
    <Container>
     <div className="row">
        <div className="col">
          <h4>Not Allowed: {permission.permission} </h4>
          You are not allowed to access this feature, please contact your
          administrator
        </div>
      </div>
    </Container>
  )
}
