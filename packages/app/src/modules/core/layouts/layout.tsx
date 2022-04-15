import * as React from 'react'
import {useRouter} from 'next/router'
import {useInitApp} from '@modules/core/hooks/use-init-app'
import {authPaths} from '@app/config/auth'
import {Flex} from '@chakra-ui/react'
import {AppLoader} from '@modules/core/components/app-loader'
import {Hotkeys} from '@modules/core/components/hotkeys'
import {AppShell, AppShellProps} from '@saas-ui/pro'
import {HotkeysListOptions} from '@saas-ui/react'
import PermissionProvider, {Permission} from '@modules/core/providers/permissions'
import {LumenUser} from '@modules/auth/auth-service'
import {useCurrentUser} from '@modules/core/hooks/use-current-user'

export const AuthLayout: React.FC = ({children, ...rest}) => {
  return (
    <Flex minH="100vh" align="center" justify="center" {...rest}>
      {children}
    </Flex>
  )
}

export const Authenticated: React.FC = ({children, ...rest}) => {
  const router = useRouter()

  const {isInitializing, isAuthenticated} = useInitApp()

  const {view, title} = authPaths[router.pathname]
    ? authPaths[router.pathname]
    : authPaths['/login']

  const code = new URL(window.location.href).searchParams.get('code')
  if (!isInitializing && !isAuthenticated && code === null) {
    router.push(view)
    return <></>
    // disable built-in views
    // return (
    //   <AuthLayout>
    //     <Container>
    //       <Logo margin="0 auto" mb="12"/>
    //       <Auth
    //         title={title}
    //         providers={authProviders}
    //         view={view}
    //         type={authType}
    //         signupLink={<Link href="/signup">Sign up</Link>}
    //         loginLink={<Link href="/login">Log in</Link>}
    //         {...rest}
    //       />
    //     </Container>
    //   </AuthLayout>
    // )
  }

  return (
    <>
      <AppLoader isLoading={isInitializing}/>
      {!isInitializing && children}
    </>
  )
}

export interface LayoutProps extends AppShellProps {
  hotkeys: HotkeysListOptions
}

export const Layout: React.FC<LayoutProps> = ({
                                                children,
                                                hotkeys,
                                                sidebar,
                                                ...rest
                                              }) => {
  return (
    <Authenticated>
      <Permissions>
        <Hotkeys hotkeys={hotkeys}>
          <AppShell sidebar={sidebar} {...rest}>
            {children}
          </AppShell>
        </Hotkeys>
      </Permissions>
    </Authenticated>
  )
}


export const Permissions: React.FC = ({children}) => {
  const {user} = useCurrentUser()
  return <PermissionProvider fetchPermission={fetchPermission(user)}>{children}</PermissionProvider>
}

const fetchPermission = (user: LumenUser) => async (permission: Permission) => {
  return Promise.resolve(user.permissions?.includes(permission) ?? false)
}
