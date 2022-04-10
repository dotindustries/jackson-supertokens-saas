import * as React from 'react'
import {Layout, LayoutProps} from '@modules/core/layouts/layout'
import {settingsHotkeys} from '@app/config/hotkeys'
import {SettingsSidebar} from '@modules/settings/components/sidebar'

export const SettingsLayout: React.FC<LayoutProps> = ({
                                                        children,
                                                        hotkeys = settingsHotkeys,
                                                        ...rest
                                                      }) => {
  return (
    <Layout hotkeys={hotkeys} {...rest} sidebar={<SettingsSidebar/>}>
      {children}
    </Layout>
  )
}
