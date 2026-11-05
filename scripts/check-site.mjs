import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { transformRussianHtml } from "../src/lib/russian-typography.js";

const outputDir = path.resolve("_site");
const htmlFiles = (await readdir(outputDir)).filter((file) => file.endsWith(".html"));
const errors = [];

for (const filename of htmlFiles) {
  const html = await readFile(path.join(outputDir, filename), "utf8");
  const expectedLang = filename === "index.html" || filename === "ru.html" || filename === "ru-new.html" || filename.endsWith("-ru.html") ? "ru" : "en";

  if (/mc\.yandex\.ru|ym\(90798039/.test(html)) {
    errors.push(`${filename}: contains Yandex Metrika`);
  }

  if (!html.includes(`<html lang="${expectedLang}">`)) {
    errors.push(`${filename}: expected lang=${expectedLang}`);
  }

  if (expectedLang === "ru" && transformRussianHtml(html) !== html) {
    errors.push(`${filename}: contains a hanging Russian short word`);
  }

  if (filename.endsWith("-ru.html") || filename.endsWith("-eng.html")) {
    const home = expectedLang === "ru" ? "index.html" : "eng.html";
    if (!html.includes(`href="${home}" class="backLink" data-return-home`)) {
      errors.push(`${filename}: close button must return to ${home}`);
    }
    const alternate = filename.replace(/-(?:ru|eng)\.html$/, expectedLang === "ru" ? "-eng.html" : "-ru.html");
    const alternateLocale = expectedLang === "ru" ? "en" : "ru";
    if (!html.includes(`hreflang="${alternateLocale}" href="https://ruminmaxim.github.io/${alternate}"`)) {
      errors.push(`${filename}: missing alternate ${alternate}`);
    }
  }

  if (filename === "index.html" || filename === "eng.html") {
    const caseLinks = [...html.matchAll(/class="newPortfolioCard" href="([^"]+)"/g)];
    if (caseLinks.length !== 6 || caseLinks.some(([, href]) => !href.endsWith(`-${expectedLang === "ru" ? "ru" : "eng"}.html`))) {
      errors.push(`${filename}: expected six portfolio links in the matching language`);
    }
    if (!html.includes('href="eng.html" aria-current="page"') && filename === "eng.html") {
      errors.push(`${filename}: English language switch is not current`);
    }
    if (!html.includes('href="eng.html"') || !html.includes('href="index.html"')) {
      errors.push(`${filename}: missing language switch`);
    }
  }

  if (["ru.html", "ru-new.html", "en-new.html", "ing.html"].includes(filename)) {
    const target = expectedLang === "ru" ? "index.html" : "eng.html";
    if (!html.includes(`content="0;url=${target}"`)) {
      errors.push(`${filename}: expected redirect to ${target}`);
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|#|data:)/.test(reference)) continue;
    const cleanReference = decodeURIComponent(reference.split("#")[0].split("?")[0]);
    if (!cleanReference) continue;
    const target = path.join(outputDir, cleanReference.replace(/^\//, ""));
    try {
      await access(target);
    } catch {
      errors.push(`${filename}: missing ${reference}`);
    }
  }
}

if (htmlFiles.length !== 32) {
  errors.push(`expected 32 HTML files, found ${htmlFiles.length}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files: all local references resolve and Metrika is absent.`);
}
