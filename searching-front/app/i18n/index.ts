import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import ru from "./ru"
import en from "./en"
import { isNode } from "app/core/helpers/common"

enum I18nLaguages {
  ru = "ru",
  en = "en",
}

const languageKey = "i18nlangugage"

export const getI18nLanguage = () => {
  let lang
  if (!isNode()) {
    lang = window.localStorage.getItem(languageKey)
  }
  return lang || "en"
}

export const setI18nLanguage = (lang: I18nLaguages) => {
  if (!isNode()) {
    window.localStorage.setItem(languageKey, lang)
  }
}

i18n.use(initReactI18next).init({
  resources: {
    ru,
    en,
  },
  fallbackLng: "en",
  lng: getI18nLanguage(),
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})

export default i18n
