export const LANGUAGES = {
  en: "English",
  ja: "Japanese",
};

export type Language = keyof typeof LANGUAGES;

export const defaultLang = "en";

/*
 * List of params for astro dynamic routing
 */
export const langParams = Object.keys(LANGUAGES).map((lang) => ({
  params: { lang: lang as Language },
}));

type Translation = {
  [key: string]: string;
};

export const translations: { [key: string]: Translation } = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.twitter": "Twitter",
  },
  ja: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
  },
} as const;
