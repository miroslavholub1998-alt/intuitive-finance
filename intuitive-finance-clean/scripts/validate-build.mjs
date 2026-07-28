import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "dist");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }

  return files;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolvesLocally(url) {
  const pathname = url.split("#", 1)[0].split("?", 1)[0];
  if (!pathname || pathname.startsWith("#")) return true;
  if (/^(?:https?:|mailto:|tel:|data:)/.test(pathname)) return true;

  const relative = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const direct = path.join(outputRoot, relative);

  return (
    (await exists(direct)) ||
    (await exists(`${direct}.html`)) ||
    (await exists(path.join(direct, "index.html")))
  );
}

const files = await walk(outputRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const errors = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const relativeName = path.relative(outputRoot, htmlFile);

  if (html.includes('class="katex-error"')) {
    errors.push(`${relativeName}: contains a KaTeX rendering error`);
  }

  const assetUrls = [
    ...html.matchAll(/\b(?:href|src)="([^"]+)"/g)
  ].map((match) => match[1]);

  for (const assetUrl of assetUrls) {
    if (!(await resolvesLocally(assetUrl))) {
      errors.push(`${relativeName}: broken local reference ${assetUrl}`);
    }
  }
}

const home = await readFile(path.join(outputRoot, "index.html"), "utf8");
if (!/<h1[^>]*>Miroslav Holub<\/h1>/.test(home)) {
  errors.push("index.html: the homepage must contain only the Miroslav Holub heading");
}
if (home.includes("Filtering, optimization, and quantitative finance case studies.")) {
  errors.push("index.html: the removed homepage subtitle is still present");
}

const articlePath = path.join(
  outputRoot,
  "articles",
  "kalman-filter",
  "index.html"
);
const article = await readFile(articlePath, "utf8");
for (const marker of [
  "1. State-Space Model",
  "2. Algorithm",
  "This formula can be derived as follows:",
  "And because we know that:",
  "we can continue as follows:",
  "3. Parameter Estimation with MLE"
]) {
  if (!article.includes(marker)) {
    errors.push(`Kalman Filter article: missing content marker "${marker}"`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML pages, local links, homepage content, and KaTeX output.`
);
