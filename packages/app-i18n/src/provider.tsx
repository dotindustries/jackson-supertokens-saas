import * as React from 'react'
import {useRouter} from 'next/router'
import {TolgeeProvider} from '@tolgee/react'
import {useAuth} from '@saas-ui/react'
import {UI} from '@tolgee/ui'

export const I18nProvider: React.FC<{}> = ({children}) => {
  let {locale: activeLocale} = useRouter()

  // fallback if next/router doesn't deliver
  if (!activeLocale) {
    activeLocale = 'en'
    if (typeof navigator !== 'undefined' && navigator.language) {
      activeLocale = navigator.language
    }
  }

  const user = useAuth() // TODO get configured language from user for override

  return (
    <TolgeeProvider
      forceLanguage={activeLocale}
      apiKey={process.env.NEXT_PUBLIC_TOLGEE_API_KEY}
      apiUrl={process.env.NEXT_PUBLIC_TOLGEE_API_URL}
      ui={UI}
      enableLanguageDetection={false}
      wrapperMode={'text'}
      staticData={{
        en: () => require('../lang/en.json'),
        // de: () => require('../lang/de.json'),
      }}
    >
      {children}
    </TolgeeProvider>
  )
}

export {T, useTranslate} from '@tolgee/react'
