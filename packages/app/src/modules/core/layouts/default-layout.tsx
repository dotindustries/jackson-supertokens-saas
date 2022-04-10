import * as React from 'react'
import {Layout, LayoutProps} from '@modules/core/layouts/layout'
import {AppSidebar} from '@modules/core/components/sidebar'

export const DefaultLayout: React.FC<LayoutProps> = ({
                                                       children,
                                                       sidebar = <AppSidebar/>,
                                                       ...rest
                                                     }) => {
  return (
    <Layout sidebar={sidebar} {...rest}>
      {children}
    </Layout>
  )
}
