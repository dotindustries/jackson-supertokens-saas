import React, {useEffect} from 'react'
import {useAuth} from '@saas-ui/auth'
import {Loader} from '@saas-ui/react'
import {useRouter} from 'next/router'

interface indexProps {
}

export const index: React.FC<indexProps> = ({}) => {
  const router = useRouter()
  const {isLoggingIn, isLoading, isAuthenticated} = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // FIXME this is never called, because of the outer auth wrapper?
      router.push('/auth/login')
    }

    if (isLoggingIn) {
      return
    }

    if (isAuthenticated) {
      router.push('/home')
    }

  }, [isLoggingIn, isLoading, isAuthenticated])

  console.log('showing loader on index')
  return <Loader />
}

export default index
