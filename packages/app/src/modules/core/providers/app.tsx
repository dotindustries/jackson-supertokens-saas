import * as React from 'react'

import {
  SaasProvider,
  AuthProvider,
  AuthProviderProps,
  ModalsProvider,
} from '@saas-ui/react'

import {TenancyProvider, Tenant} from '@saas-ui/pro'

import {I18nProvider} from '@app/i18n'

import {theme} from '@ui/theme'
import AppLayout from '@modules/core/layouts/app-layout'

import {Form} from '@saas-ui/react'
import {yupResolver, yupFieldResolver} from '@saas-ui/forms/yup'
import {AnyObjectSchema} from 'yup'

/**
 * Use the Yup resolver as default in all forms
 */
Form.getResolver = (schema: AnyObjectSchema) => yupResolver(schema)
Form.getFieldResolver = (schema: AnyObjectSchema) => yupFieldResolver(schema)

export interface AppProviderProps {
  linkComponent?: React.ElementType<any>
  authService?: AuthProviderProps
  tenant?: Tenant | null
  onTenantChange?: (key: string) => void
  cookies?: any
  onError?: (error: Error, info: any) => void
  isPublic?: boolean
  layout?: React.ReactNode
  sidebar?: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const {
    linkComponent,
    tenant,
    onTenantChange,
    cookies,
    onError,
    authService,
    isPublic,
    layout,
    sidebar,
    children
  } = props
  return (
    <SaasProvider
      cookies={cookies}
      linkComponent={linkComponent}
      onError={onError}
      theme={theme}
    >
      <AuthProvider {...authService}>
        <I18nProvider>
          <TenancyProvider tenant={tenant} onChange={onTenantChange}>
            <ModalsProvider>
              <AppLayout
                isPublic={isPublic}
                layout={layout}
                sidebar={sidebar}
              >
                {children}
              </AppLayout>
            </ModalsProvider>
          </TenancyProvider>
        </I18nProvider>
      </AuthProvider>
    </SaasProvider>
  )
}
