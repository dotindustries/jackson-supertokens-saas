import { createPage } from '@app/nextjs'
import { MembersSettingsPage } from '@modules/settings'
import { permissionOf, res } from '@app/config/auth'
import { useTenant } from '@saas-ui/pro'

const useOrgResource = () => {
  const tenant = useTenant()
  if (!tenant) {
    return {
      resource: undefined,
      isLoading: false,
    }
  }
  const {objectId, objectType} = res(tenant, 'org')
  return {
    resource: {objectId, objectType},
    isLoading: false,
  }
}

export default createPage({
  title: 'Members',
  layout: 'settings',
  permission: {
    resourceFn: useOrgResource,
    permission: permissionOf('org', 'invite_members')
  },
  renderComponent: () => {
    return <MembersSettingsPage />
  },
})
