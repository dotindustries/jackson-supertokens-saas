
import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .max(25, 'Too long')
    .required()
    .label('Name'),
})

import { Section, useTenant } from '@saas-ui/pro'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormLayout,
  Field,
  useSnackbar,
} from '@saas-ui/react'
import { SettingsPage } from '@modules/core/components/settings-page'
import {trpc} from '@modules/utils/trpc'
import {Organization} from '@server/organization'

interface OrganizationDetailsProps {
  organization?: Organization | null
}

function OrganizationDetails({ organization }: OrganizationDetailsProps) {
  const snackbar = useSnackbar()
  const { isLoading, mutateAsync: updateOrganization } = trpc.useMutation(['org.update'])

  let form
  if (organization) {
    form = (
      <Form
        schema={schema}
        defaultValues={{
          name: organization.name,
        }}
        onSubmit={(data) => {
          return updateOrganization({
            organizationId: organization.id,
            name: data.name,
          }).then(() =>
            snackbar({
              description: 'Updated the organization',
            }),
          )
        }}
      >
        <CardBody>
          <FormLayout>
            <Field name="name" label="Organization name" />
            <Field name="email" label="Email address" />
          </FormLayout>
        </CardBody>
        <CardFooter>
          <Button
            variant="solid"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
          >
            Save
          </Button>
        </CardFooter>
      </Form>
    )
  }
  return (
    <Section
      title="Organization details"
      description="Basic details about your organization."
      isAnnotated
    >
      <Card>{form}</Card>
    </Section>
  )
}

export function OrganizationSettingsPage() {
  const tenant = useTenant()

  const { data, isLoading, error } = trpc.useQuery(['org.get', {
    slug: tenant,
  }])

  const organization = data?.organization

  return (
    <SettingsPage
      isLoading={isLoading}
      title="Organization"
      description="Manage your organization settings"
    >
      <OrganizationDetails organization={organization} />
    </SettingsPage>
  )
}
