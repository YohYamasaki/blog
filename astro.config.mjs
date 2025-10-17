// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// https://astro.build/config
export default defineConfig({
  site: "https://yayo1.com",
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex]],
    }),
    sitemap(),
    solidJs(),
  ],
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
  },
});
