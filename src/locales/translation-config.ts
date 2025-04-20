import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import bg from "./bg";

export const LANGUAGES = {
  EN: "en",
  BG: "bg",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

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
