import React from 'react'
import {AuthActionEnum, Field, FieldErrors, Form, FormLayout, FormProps, LoginButton, useLogin} from '@saas-ui/react'
import {SubmitHandler} from 'react-hook-form'
import {AuthFormSuccess} from '@modules/auth/components/AuthFormSuccess'
import {useTranslate} from '@app/i18n'

interface SubmitParams {
  email: string
}

export interface SAMLFormProps
  extends Pick<FormProps<SubmitParams>, 'schema' | 'resolver'> {
  action?: AuthActionEnum
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onValidationError?: (error: FieldErrors<SubmitParams>) => void
  submitLabel?: string
  defaultValues?: Record<string, any>
  renderSuccess?: (data: any) => React.ReactElement
}

export const SAMLForm: React.FC<SAMLFormProps> = ({
                                                    action = 'logIn',
                                                    onSuccess = () => null,
                                                    onError = () => null,
                                                    onValidationError,
                                                    submitLabel,
                                                    defaultValues,
                                                    children,
                                                    renderSuccess,
                                                    ...formProps
                                                  }) => {
  const t = useTranslate()
  // defaults
  if (!submitLabel) {
    submitLabel = t('auth.login_with_email', 'Continue with Email')
  }
  if (!renderSuccess) {
    renderSuccess = () => (
      <AuthFormSuccess
        title={t('auth.success_title', 'Success!')}
        description={t('auth.success_description', 'Check your mailbox to verify your account.')}
      />
    )
  }
  const [{isLoading, isResolved, data, error, isRejected}, submit] = useLogin({
    action
  })

  const handleSubmit: SubmitHandler<SubmitParams> = ({email}) => {
    return submit({email}).then(onSuccess).catch(onError)
  }

  // Succesful magic link login might not always return data
  // so we check if the action resolved without errors
  if (isResolved) {
    return renderSuccess(data)
  }

  if (isRejected) {
    onError(error)
    return <></>
  }

  return (
    <Form
      onSubmit={handleSubmit}
      onError={onValidationError}
      defaultValues={{email: '', ...defaultValues}}
      {...formProps}
    >
      <FormLayout>
        <Field
          name="email"
          label={t('auth.email_address', 'E-mail address')}
          type="email"
          rules={{required: true}}
        />

        {children}

        <LoginButton
          type="submit"
          isLoading={isLoading}
          isFullWidth
          label={submitLabel}
        />
      </FormLayout>
    </Form>
  )
}
