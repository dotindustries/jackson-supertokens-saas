import { createPage } from '@app/nextjs'

import { GettingStartedPage } from '@modules/getting-started'

export default createPage({
  title: 'Getting started',
  layout: 'fullscreen',
  // set required permission to view page
// permission: 'create_company',
  renderComponent: () => {
    return <GettingStartedPage />
  },
})
