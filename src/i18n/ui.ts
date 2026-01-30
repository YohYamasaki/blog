export const LANGUAGES = {
  en: "English",
  ja: "日本語",
};

export type Language = keyof typeof LANGUAGES;

export const defaultLang = "en";

/*
 * List of params for astro dynamic routing
 */
export const langParams = Object.keys(LANGUAGES).map((lang) => ({
  params: { lang: lang as Language },
}));

type TranslationKey =
  | "about.mainText"
  | "blogIndex.title"
  | "blogIndex.description";

type Translation = Record<TranslationKey, string>;

export const translations: Record<Language, Translation> = {
  en: {
    "about.mainText":
      "I am a software engineer and a computer science student based in Germany with a keen interest in the intersection of web technology and 2D graphics.",
    "blogIndex.title": "Blog",
    "blogIndex.description":
      "Here are some of my miscellaneous articles about software",
  },
  ja: {
    "about.mainText":
      "ドイツでWEBエンジニアをしています。パートタイムのコンピューターサイエンス学生でもある。2DグラフィックスとWEB技術に興味があります。",
    "blogIndex.title": "ブログ",
    "blogIndex.description":
      "主にUniversity of London Computer Science BScのことなどの雑記",
  },
} as const;
