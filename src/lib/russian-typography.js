// Keep short Russian function words with the word that follows them.
const shortWords = "в|во|к|ко|с|со|у|о|об|обо|а|и|но|на|по|за|из|от|до|при|для|без|под|над|про|не";
const hangingWord = new RegExp(`(?<![\\p{L}\\p{N}])(${shortWords})([ \\t\\r\\n]+)(?=(?:[«„“\"(]|&laquo;|&#(?:171|x0*ab);)?[\\p{L}\\p{N}])`, "giu");

export function fixRussianText(text) {
  return text.replace(hangingWord, (_match, word) => `${word}&nbsp;`);
}

export function transformRussianHtml(html) {
  // Splitting on tags keeps markup and attributes intact. Script and style
  // bodies are skipped because they are not visible page copy.
  let skipped = null;
  return html.split(/(<[^>]+>)/g).map((part) => {
    if (part.startsWith("<")) {
      if (/^<(script|style)\b/i.test(part)) skipped = part.match(/^<(script|style)\b/i)[1].toLowerCase();
      if (skipped && new RegExp(`^<\\/${skipped}\\s*>`, "i").test(part)) skipped = null;
      return part;
    }
    return skipped ? part : fixRussianText(part);
  }).join("");
}
