import {useGetCurrentUser} from '@modules/core/hooks/use-get-current-user'

export const useGetTenants = () => {
  const user = useGetCurrentUser()

  return (
    user?.profile?.organizations?.map((organization) => ({
      id: organization.id,
      slug: organization.slug,
      label: organization.name || organization.id,
      href: `/app/${organization.slug}`,
    })) || []
  )
}
