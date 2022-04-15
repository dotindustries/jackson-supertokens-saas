import React, {useEffect} from 'react'
import {useAuth} from '@saas-ui/auth'
import {Loader} from '@saas-ui/react'
import {useTenant} from '@saas-ui/pro'
import {useRouter} from 'next/router'
import {useCurrentUser} from '@modules/core/hooks/use-current-user'

interface indexProps {
}

export const index: React.FC<indexProps> = ({}) => {
  const router = useRouter()
  const {isLoggingIn, isAuthenticated} = useAuth()
  const tenant = useTenant()
  const {user} = useCurrentUser()

  useEffect(() => {
    if (isLoggingIn) {
      return
    }

    if (!isAuthenticated) {
      console.error('FATAL: we rendered home and we are not authenticated')
      router.push('/home')
    }

    if (user && (!user.profile.organizations || !user.profile.organizations.length)) {
      router.push('/app/getting-started')
    } else if (tenant) {
      router.push(`/app/${tenant}`)
    } else if (user?.profile.organizations[0]) {
      router.push(`/app/${user.profile.organizations[0].slug}`)
    }
  }, [isLoggingIn, user])

  console.log('showing loader on index')
  return <Loader />
}

export default index
