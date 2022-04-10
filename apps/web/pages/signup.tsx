import {createPage} from '@app/nextjs'
import {useAuth} from '@saas-ui/auth'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {SignupPage} from '@modules/auth'

export default createPage({
  title: 'Signup',
  isPublic: true,
  renderComponent: () => {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
      if (isAuthenticated) {
        router.push('/')
      }
    }, [isAuthenticated])

    return <SignupPage />
  }
})
