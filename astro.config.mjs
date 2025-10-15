// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import vercelStatic from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://yutohosaka.com",
  integrations: [mdx(), sitemap(), solidJs()],
  trailingSlash: "never",
  build: {
    assets: "assets",
    format: "directory",
  },
  server: {
    port: 8080,
  },
  output: "static",
  adapter: vercelStatic({
    webAnalytics: {
      enabled: true,
    },
  }),
  redirects: {
    "/": "/en",
  },
});
