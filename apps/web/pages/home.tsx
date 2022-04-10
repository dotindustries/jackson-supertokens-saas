import Head from 'next/head'
import Image from 'next/image'
import {Container} from '@chakra-ui/react'
import {Card, CardContainer} from '@saas-ui/react'
import {useAuth} from '@saas-ui/auth'
import {createPage} from '@app/nextjs'

const Home = createPage({
  title: 'Home',
  renderComponent: (props) => {
    const {user} = useAuth()

    return (
      <Container>
        <Head>
          <title>SAML Jackson & Supertokens Demo</title>
          <meta name="description" content="SAML Jackson & Supertokens Demo"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main >
          <h1 >
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <CardContainer>
            <Card>
              <h2>User</h2>
              <p>{user?.id}</p>
            </Card>

            <Card>
              <h2>User data</h2>
              <pre>{JSON.stringify(user?.accessTokenPayload, null, '  ')}</pre>
            </Card>
          </CardContainer>
        </main>

        <footer>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
          </a>
        </footer>
      </Container>
    )
  }
})

export default Home
