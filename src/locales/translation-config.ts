import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import bg from "./bg";
import { LANGUAGES } from "@/constants/Languages";

i18next.use(initReactI18next).init({
  fallbackLng: LANGUAGES.EN,
  resources: {
    en: {
      translation: en,
    },
    bg: {
      translation: bg,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
