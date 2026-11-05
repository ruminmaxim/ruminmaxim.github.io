import { transformRussianHtml } from "./src/lib/russian-typography.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addTransform("russian-typography", function (content, outputPath) {
    if (!outputPath?.endsWith(".html") || !/<html\s+lang="ru">/.test(content)) return content;
    return transformRussianHtml(content);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk"]
  };
}
