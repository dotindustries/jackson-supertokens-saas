import React, {useEffect} from 'react'
import {useAuth} from '@saas-ui/auth'
import {Loader} from '@saas-ui/react'
import {useRouter} from 'next/router'

interface indexProps {
}

export const index: React.FC<indexProps> = ({}) => {
  const router = useRouter()
  const {isLoggingIn, user} = useAuth()

  useEffect(() => {
    if (isLoggingIn || !user) {
      return
    }

    if (user) {
      router.push('/home')
    }

  }, [isLoggingIn, user])

  return <Loader />
}

export default index
