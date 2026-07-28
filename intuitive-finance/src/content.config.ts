import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({
    base: "./src/content/articles",
    pattern: "**/[^_]*.md"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    section: z.enum(["filtering", "other", "case-studies"]),
    order: z.number().int().nonnegative(),
    draft: z.boolean().default(false)
  })
});

export const collections = { articles };
