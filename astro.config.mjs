// @ts-check
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkLinkCard from "remark-link-card-plus";
import remarkSpeakerDeck from "./src/plugins/remark-speaker-deck.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://yayo1.com",
  integrations: [mdx(), sitemap(), solidJs()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkSpeakerDeck, remarkLinkCard],
      rehypePlugins: [rehypeKatex],
    }),
  },
  trailingSlash: "never",
  build: {
    assets: "assets",
    format: "directory",
  },
  server: {
    port: 8080,
  },
  output: "static",
  redirects: {
    "/": "/ja",
    "/blog/2023-2024-uol-review/": "/ja/blog/2023-2024-uol-review/",
    "/blog/2022autumn_uol_review/": "/ja/blog/2022autumn_uol_review/",
    "/blog/2022s_uol_review/": "/ja/blog/2022s_uol_review/",
    "/blog/enroll_at_uol/": "/ja/blog/enroll_at_uol/",
    "/en/blog/adaptive-tessellation-of-bezier-surfaces/":
      "/en/blog/adaptive-watertight-tessellation-of-bezier-surfaces/",
  },
});
