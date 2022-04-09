import {trpc} from '@modules/utils/trpc'

export const useGetTenants = () => {
  const { data } = trpc.useQuery(['user.me'])

  return (
    data?.profile?.organizations?.map((organization) => ({
      id: organization.id,
      slug: organization.slug,
      label: organization.name || organization.id,
      href: `/app/${organization.slug}`,
    })) || []
  )
}
