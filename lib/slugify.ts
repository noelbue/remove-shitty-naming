const REPLACEMENTS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  æ: "ae",
  ø: "oe",
  å: "aa",
  "&": "_and_",
};

// Keep in sync with cli/rsn
export function slugify(input: string): string {
  // NFC first: macOS file names are often decomposed (u + ¨)
  let s = input.normalize("NFC").trim().toLowerCase();

  // German umlauts & friends → transliteration
  s = s.replace(/[äöüßæøå&]/g, (c) => REPLACEMENTS[c] ?? c);

  // Strip remaining accents (é → e, à → a, …)
  s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Everything that isn't a-z, 0-9 or "-" becomes a separator
  s = s.replace(/[^a-z0-9-]+/g, "_");

  // Runs of "-" / "_": with an underscore → "_", only hyphens → "-"
  s = s.replace(/[-_]+/g, (m) => (m.includes("_") ? "_" : "-"));

  // Trim separators from the edges
  s = s.replace(/^[_-]+|[_-]+$/g, "");

  return s;
}
