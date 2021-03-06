import * as React from 'react'
import {useSnackbar, useModals, useCurrentUser} from '@saas-ui/react'
import {Page, Section, useTenant} from '@saas-ui/pro'

import {
  MembersList
} from '@modules/organizations/components/members-list'
import {MembersInviteData} from '@modules/organizations/components/members-invite-dialog'
import {trpc} from '@modules/utils/trpc'
import {Member} from '@server/organization'

export function MembersSettingsPage() {
  const tenant = useTenant()
  const snackbar = useSnackbar()
  const modals = useModals()

  const {data, isLoading} = trpc.useQuery(['org.get', {slug: tenant}])

  const organization = data?.organization

  if (!isLoading && !organization) {
    return null
  }

  const members = organization?.members || []


  const inviteToOrganization = trpc.useMutation(['org.inviteMember'])

  const removeUserFromOrganization = trpc.useMutation(['org.removeMember'])

  const onInvite = async ({emails, role}: MembersInviteData) => {
    if (!organization) return

    return snackbar.promise(
      inviteToOrganization.mutateAsync({
        organizationId: organization.id,
        emails,
        role
      }),
      {
        loading:
          emails.length === 1
            ? `Inviting ${emails[0]}...`
            : `Inviting ${emails.length} people...`,
        success: `Invitation(s) have been sent.`,
        error: (err: Error) => err
      }
    )
  }

  const onCancelInvite = async (member: Member) => {
    if (!organization) return

    return snackbar.promise(
      removeUserFromOrganization.mutateAsync({
        userId: member.id,
        organizationId: organization.id
      }),
      {
        loading: `Removing ${member.email}...`,
        success: `Removed ${member.email}!`,
        error: (err: Error) => err
      }
    )
  }

  const onRemove = (member: Member) => {
    if (!organization) return

    modals.confirm?.({
      title: 'Remove member',
      body: `Are you sure you want to remove ${member.email} from ${
        organization.name || 'this organization'
      }?`,
      confirmProps: {
        colorScheme: 'red',
        label: 'Remove'
      },
      onConfirm: () =>
        snackbar.promise(
          removeUserFromOrganization.mutateAsync({
            organizationId: organization.id,
            userId: member.id
          }),
          {
            loading: `Removing ${member.email}...`,
            success: `Removed ${member.email}!`,
            error: (err: Error) => err
          }
        )
    })
  }

  const onUpdateRoles = async (member: Member, roles: string[]) => {
    return null
  }

  return (
    <Page
      isLoading={isLoading}
      variant="settings"
      title="Members"
      description="Manage who can access your organization"
    >
      <Section title="Members" description="Invite your colleagues" isAnnotated>
        <MembersList
          members={members}
          onInvite={onInvite}
          onCancelInvite={onCancelInvite}
          onRemove={onRemove}
          onUpdateRoles={onUpdateRoles}
        />
      </Section>
    </Page>
  )
}
