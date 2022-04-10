import React, {useState} from 'react'

import {Container, Stack} from '@chakra-ui/react'
import {T, useTranslate} from '@app/i18n'
import {Link} from '@modules/core/components/link'

import {AuthFormTitle, Loader, PasswordForm, useAuth} from '@saas-ui/react'
import {Logo} from '@modules/core/components/logo'
import {SAMLForm} from '@modules/auth/components/SAMLForm'

export const LoginPage = () => {
  const [companyNotFound, setCompanyNotFound] = useState(false)
  const {isAuthenticated} = useAuth()
  const t = useTranslate()

  if (isAuthenticated) {
    return <Loader/>
  }

  return (
    <Stack flex="1" direction="row">
      <Stack
        flex="1"
        alignItems="center"
        justify="center"
        direction="column"
        spacing="8"
      >
        <Container>
          <Logo margin="0 auto" mb="12"/>
          <AuthFormTitle><T keyName="auth.header_title">Welcome back</T></AuthFormTitle>
          {companyNotFound
            ? null
            : <SAMLForm action="logIn" submitLabel={t('auth.login_button')} onError={e => {
              // FIXME Cannot update a component (`LoginPage`) while rendering a different component (`SAMLForm`). To locate the bad setState()
              setCompanyNotFound(true)
            }}/>}
          {!companyNotFound
            ? null
            : <PasswordForm action="logIn" submitLabel={t('auth.login_button')}/>
          }
        </Container>

        <Link href="/signup"><T keyName="auth.no_account_signup_suggest">Don't have an account yet? Sign up.</T></Link>
      </Stack>
    </Stack>
  )
}
