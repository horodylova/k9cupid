const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: "\"",
  apos: "'",
  lt: "<",
  gt: ">",
};

function decodeEntity(entity: string) {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    if (!Number.isFinite(codePoint)) return null;
    return String.fromCodePoint(codePoint);
  }

  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    if (!Number.isFinite(codePoint)) return null;
    return String.fromCodePoint(codePoint);
  }

  return NAMED_ENTITIES[entity] ?? null;
}

export function normalizeHtmlText(input: string) {
  let text = input || "";

  text = text.replace(/<\s*br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  text = text.replace(/<\/?p[^>]*>/gi, "");
  text = text.replace(/<[^>]+>/g, "");

  text = text.replace(/&([^;\s]+);/g, (full, entity) => decodeEntity(entity) ?? full);
  text = text.replace(/\u00a0/g, " ");

  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/[ \t]{2,}/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

