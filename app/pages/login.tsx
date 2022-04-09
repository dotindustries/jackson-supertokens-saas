import React, {useEffect} from 'react'
import {LoginView, useAuth} from '@saas-ui/auth'
import {useRouter} from 'next/router'
import {Container, Stack} from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react'
import {LinkProps, useLink} from '@saas-ui/react'

export const Link = React.forwardRef(
  (props: LinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    const { href } = props

    const LinkWrapper = useLink()

    return (
      <LinkWrapper href={href} passHref>
        <ChakraLink href={href} {...props} ref={ref} />
      </LinkWrapper>
    )
  },
)

interface loginProps {
}

export const login: React.FC<loginProps> = ({}) => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated])
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
          <LoginView title="Log in" type="magiclink" />
        </Container>

        <Link href="/signup">Don't have an account yet? Sign up.</Link>
      </Stack>
    </Stack>
  )
}

export default login
