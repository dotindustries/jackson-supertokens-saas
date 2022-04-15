import React from 'react'
import {Container} from '@chakra-ui/react'
import {Permission} from '@modules/core/providers/permissions'

interface PermissionDeniedProps {
  permission: Permission
}

export const PermissionDenied: React.FC<PermissionDeniedProps> = ({permission}) => {
  return (
    <Container>
      <div className="row">
        <div className="col">
          <h4>Not Allowed </h4>
          You are not allowed to access this feature, please contact your administrator
        </div>
      </div>
    </Container>
  )
}
