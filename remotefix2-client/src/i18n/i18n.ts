import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem("i18nextLng");
  if (savedLanguage) {
    return savedLanguage;
  }
  return ["en", "ar"].includes(navigator.language?.substring(0, 2))
    ? navigator.language?.substring(0, 2)
    : "en";
};

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

if (initialLanguage === "ar") {
  document.documentElement.setAttribute("dir", "rtl");
} else {
  document.documentElement.setAttribute("dir", "ltr");
}

export default i18n;
