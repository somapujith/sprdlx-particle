import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "contact": "Contact"
      },
      "ui": {
        "sound_on": "SOUND: ON",
        "sound_off": "SOUND: OFF",
        "particles": "PARTICLES",
        "solid": "SOLID"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
