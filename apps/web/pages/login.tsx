import {createPage} from '@app/nextjs'
import {useAuth} from '@saas-ui/auth'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {LoginPage} from '@modules/auth'

// TODO discuss why this content doesn't matter on landing page?
export default createPage({
  title: 'Login',
  layout: 'auth',
  isPublic: true,
  renderComponent: () => {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
      if (isAuthenticated) {
        router.push('/')
      }
    }, [isAuthenticated])

    return <LoginPage />
  }
})
