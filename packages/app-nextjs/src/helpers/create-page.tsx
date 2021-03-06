import React from 'react'
import Head from 'next/head'
import {Restricted} from 'app/src/modules/auth/components/Restricted'
import {Permission} from 'app/src/modules/core/providers/permissions'

interface CreatePageProps {
  title?: string
  layout?: React.ReactNode
  isPublic?: boolean
  renderComponent: React.FC
  permission?: Permission
}

interface PageFC extends React.FC {
  layout?: React.ReactNode
  isPublic?: boolean
  permission?: Permission
}

/**
 * @todo implement features/roles/auth/layouts/data loading?
 *
 * Inspired by
 * https://blog.rstankov.com/structuring-next-js-application/
 */
export const createPage = (props: CreatePageProps): PageFC => {
  const { title, layout, isPublic, renderComponent: PageComponent, permission } = props

  const Page: PageFC = (props) => {
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>

        <Restricted to={permission}>
          <PageComponent />
        </Restricted>
      </>
    )
  }

  Page.layout = layout
  Page.isPublic = isPublic
  Page.permission = permission
  return Page
}
