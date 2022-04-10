import * as React from 'react'
import {Layout, LayoutProps} from '@modules/core/layouts/layout'
import {fullscreenHotkeys} from '@app/config/hotkeys'

export const FullscreenLayout: React.FC<LayoutProps> = ({
                                                          children,
                                                          hotkeys = fullscreenHotkeys,
                                                          ...rest
                                                        }) => {
  return (
    <Layout hotkeys={hotkeys} {...rest}>
      {children}
    </Layout>
  )
}
