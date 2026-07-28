import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://intuitive-finance.pages.dev",
  output: "static",
  trailingSlash: "never",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            strict: "ignore",
            throwOnError: true
          }
        ]
      ]
    })
  }
});
