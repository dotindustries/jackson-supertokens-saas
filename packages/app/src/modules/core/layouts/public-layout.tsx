import * as React from 'react'
import {AppShell, AppShellProps} from '@saas-ui/pro'

export const PublicLayout: React.FC<AppShellProps> = ({
                                                        children,
                                                        ...rest
                                                      }) => {
  return <AppShell {...rest}>{children}</AppShell>
}
