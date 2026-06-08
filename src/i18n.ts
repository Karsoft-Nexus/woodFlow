import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import kkTranslations from './locales/kk.json'
import ruTranslations from './locales/ru.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      kk: { translation: kkTranslations },
      ru: { translation: ruTranslations }
    },
    lng: 'kk',
    fallbackLng: 'kk',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
