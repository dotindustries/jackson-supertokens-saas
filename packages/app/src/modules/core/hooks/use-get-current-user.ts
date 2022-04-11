import {trpc} from '@modules/utils/trpc'

export const useGetCurrentUser = () => {
  const { data } = trpc.useQuery(['user.me'])

  return data
}
