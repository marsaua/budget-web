import { CATEGORY_KEYWORDS } from "../constants";

function buildKeywordMap() {
  const map = new Map();
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const word of words) {
      map.set(word.toLowerCase(), cat);
    }
  }
  return map;
}

const KEYWORD_MAP = buildKeywordMap();

export function parseInput(raw) {
  const tokens = raw.trim().split(/\s+/);
  if (tokens.length === 0) return null;

  // Find amount: last token that looks like a number
  let amountIdx = -1;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const n = parseFloat(tokens[i].replace(",", "."));
    if (!isNaN(n) && n > 0) {
      amountIdx = i;
      break;
    }
  }
  if (amountIdx === -1) return null;

  const amount = parseFloat(tokens[amountIdx].replace(",", "."));
  const remaining = [...tokens.slice(0, amountIdx)];

  // Find category keyword scanning right-to-left
  let category = "other";
  let categoryTokenIdx = -1;
  for (let i = remaining.length - 1; i >= 0; i--) {
    const key = remaining[i].toLowerCase();
    if (KEYWORD_MAP.has(key)) {
      category = KEYWORD_MAP.get(key);
      categoryTokenIdx = i;
      break;
    }
  }

  const descTokens = remaining.filter((_, i) => i !== categoryTokenIdx);
  const description = descTokens.join(" ").trim() || remaining.join(" ").trim() || "Transaction";

  return { description, amount, category };
}
