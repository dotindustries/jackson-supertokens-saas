import * as React from 'react'
import {useRouter} from 'next/router'
import {TolgeeProvider} from '@tolgee/react'
import {useAuth} from '@saas-ui/react'
// TODO add static languages after translation complete
// import enLocale from '../lang/en.json'
// import csLocale from '../lang/cs.json'

export const I18nProvider: React.FC<{}> = ({children}) => {
  let {locale: activeLocale} = useRouter()
  const user = useAuth() // TODO get configured language from user for override

  // fallback if next/router doesn't deliver
  if (!activeLocale) {
    activeLocale = 'en'
    if (typeof navigator !== 'undefined' && navigator.language) {
      activeLocale = navigator.language
    }
  }

  return (
    <TolgeeProvider
      forceLanguage={activeLocale}
      apiKey={process.env.NEXT_PUBLIC_TOLGEE_API_KEY}
      apiUrl={process.env.NEXT_PUBLIC_TOLGEE_API_URL}
      // staticData={{
      //   en: enLocale,
      //   cs: csLocale
      // }}
    >
      {children}
    </TolgeeProvider>
  )
}

export {T, useTranslate} from '@tolgee/react'
