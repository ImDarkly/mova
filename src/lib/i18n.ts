import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "@/locales/index"

i18n.use(initReactI18next).init({
  resources: {
    en,
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React handles XSS
  },
})

export default i18n
