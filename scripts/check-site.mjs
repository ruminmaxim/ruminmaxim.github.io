import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("_site");
const htmlFiles = (await readdir(outputDir)).filter((file) => file.endsWith(".html"));
const errors = [];

for (const filename of htmlFiles) {
  const html = await readFile(path.join(outputDir, filename), "utf8");
  const expectedLang = filename === "ru.html" || filename.endsWith("-ru.html") ? "ru" : "en";

  if (/mc\.yandex\.ru|ym\(90798039/.test(html)) {
    errors.push(`${filename}: contains Yandex Metrika`);
  }

  if (!html.includes(`<html lang="${expectedLang}">`)) {
    errors.push(`${filename}: expected lang=${expectedLang}`);
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

if (htmlFiles.length !== 28) {
  errors.push(`expected 28 HTML files, found ${htmlFiles.length}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files: all local references resolve and Metrika is absent.`);
}
