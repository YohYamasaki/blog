export const LANGUAGES = {
  en: "English",
  ja: "日本語",
};

export type Language = keyof typeof LANGUAGES;

export const defaultLang = "en";

/*
 * List of params for astro dynamic routing
 */
export const getLangParams = () =>
  Object.keys(LANGUAGES).map((lang) => ({
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
      "I am a software engineer and a computer science student based in Kyoto with a keen interest in vector graphics and parallel computing.",
    "blogIndex.title": "Blog",
    "blogIndex.description":
      "Here are some of my miscellaneous articles about software",
  },
  ja: {
    "about.mainText":
      "ドイツでWEBエンジニアをしていて2026年現在京都在住。パートタイムのコンピューターサイエンス学生でもある。ベクターグラフィックスとGPUでの並列処理に興味があります。",
    "blogIndex.title": "ブログ",
    "blogIndex.description":
      "主にUniversity of London Computer Science BScのことなどの雑記",
  },
} as const;
