import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import engTranslation from "locales/en/engTranslation.json";
import viTranslation from "locales/vi/viTranslation.json";

const resources = {
  en: {
    translation: engTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "vi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
