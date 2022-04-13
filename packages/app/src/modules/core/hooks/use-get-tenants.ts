import {useCurrentUser} from '@modules/core/hooks/use-current-user'

export const useGetTenants = () => {
  const user = useCurrentUser()

  return (
    user?.profile.organizations?.map((organization) => ({
      id: organization.id,
      slug: organization.slug,
      label: organization.name || organization.id,
      href: `/app/${organization.slug}`,
    })) || []
  )
}
