import React from 'react'
import {Loader} from '@saas-ui/react'
import {useRouter} from 'next/router'

interface callbackProps {
}

// Code recipient of SSO callback
export const callback: React.FC<callbackProps> = ({}) => {
  const router = useRouter()
  const code = new URL(window.location.href).searchParams.get('code')
  // TODO replace block with SuperTokens helper method to check local state
  console.log('received code', code)
  fetch('http://localhost:3000/api/auth/signinup', {
    method: 'POST',
    headers: {
      'rid': 'thirdpartyemailpassword',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      redirectURI: 'http://localhost:3000/auth/callback/saml-jackson',
      thirdPartyId: 'saml-jackson'
    })
  }).then(response => {
    response.json().then(resp => {
      // {
      //   "status": "OK",
      //   "user": {
      //     "id": "fa7a0841-b533-4478-95533-0fde890c3483",
      //     "email": "johndoe@gmail.com"
      //   },
      //   "createdNewUser": true
      // }
      if (resp.status === 'OK' && resp.user !== undefined) {
        router.push('/')
      } else {
        router.push('/login')
      }
    })
  })

  return <Loader />
}

export default callback
