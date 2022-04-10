import * as React from 'react'
import {useRouter} from 'next/router'

import {Flex} from '@chakra-ui/react'
import {SettingsLayout} from '@modules/core/layouts/settings-layout'
import {FullscreenLayout} from '@modules/core/layouts/fullscreen-layout'
import {PublicLayout} from '@modules/core/layouts/public-layout'
import {DefaultLayout} from '@modules/core/layouts/default-layout'

interface AppLayoutProps {
  children: React.ReactNode
  publicRoutes?: Array<string>
  isPublic?: boolean
  layout?: React.ReactNode
  sidebar?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  publicRoutes = [],
  isPublic,
  layout,
  ...rest
}) => {
  const router = useRouter()
  const isPublicRoute = publicRoutes.indexOf(router.pathname) !== -1 || isPublic

  let LayoutComponent
  if (isPublicRoute) {
    LayoutComponent = PublicLayout
  } else if (typeof layout === 'function') {
    LayoutComponent = layout
  } else {
    switch (layout) {
      case 'settings':
        LayoutComponent = SettingsLayout
        break
      case 'fullscreen':
        LayoutComponent = FullscreenLayout
        break
      default:
        LayoutComponent = DefaultLayout
    }
  }

  return (
    <Flex
      position="absolute"
      w="100vw"
      h="100vh"
      fontSize="sm"
      flexDirection="column"
    >
      <LayoutComponent flex="1" minH="0" {...rest}>
        {children}
      </LayoutComponent>
    </Flex>
  )
}

export default AppLayout
