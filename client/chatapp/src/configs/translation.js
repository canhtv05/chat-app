import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import keyStorage from '~/configs/storage';
import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';

// the translations
const resources = {
    en: { translation: translationEN },
    vi: { translation: translationVI },
};

let dataStorage = JSON.parse(localStorage.getItem(keyStorage.key)) || {};

if (!dataStorage.language) {
    dataStorage = { ...dataStorage, language: 'en' };
    localStorage.setItem(keyStorage.key, JSON.stringify(dataStorage));
}

const language = dataStorage.language;

i18next.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
        escapeValue: false,
    },
});

export default i18next;
