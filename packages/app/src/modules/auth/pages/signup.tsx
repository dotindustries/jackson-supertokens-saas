import { Container, Stack } from '@chakra-ui/react'
import { Link } from '@modules/core/components/link'

import { Loader, SignupView, useAuth } from '@saas-ui/react'

export const SignupPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Loader />
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
          <SignupView title="Sign up" type="magiclink" />
        </Container>

        <Link href="/login">Already have an account? Log in.</Link>
      </Stack>
      <Stack flex="1" bg="primary.500"></Stack>
    </Stack>
  )
}