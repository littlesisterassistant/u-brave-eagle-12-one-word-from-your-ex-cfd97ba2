// One Word From Your Ex — entrypoint.
// Writes exactly one word to $MAKEFUN_OUTPUT_DIR/entry.txt (default
// /output): the word an ex would use to describe you. Node 22,
// standard library only. No trailing newline: the file holds the
// word and nothing else.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Archived";
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MIN_CHARS = 1;
const MAX_CHARS = 24;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The gate allows 1 to 24 characters, one word, not whitespace-only.
const chars = [...WORD];
if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
  fail(`word is ${chars.length} characters, outside the 1-24 range`);
}
if (WORD.trim() !== WORD || /\s/.test(WORD)) {
  fail("word must be a single word with no whitespace");
}
if (WORD.trim().length === 0) {
  fail("word must not be whitespace-only");
}

mkdirSync(OUT_DIR, { recursive: true });
const target = join(OUT_DIR, "entry.txt");
writeFileSync(target, WORD, "utf8");

// Verify by reading it back as raw bytes: the file must be
// byte-identical to the word's UTF-8 encoding, so no encoding
// drift or stray newline can slip through unnoticed.
const written = readFileSync(target);
if (!written.equals(Buffer.from(WORD, "utf8"))) {
  fail("read-back mismatch: entry.txt differs from the word");
}

console.log(`wrote ${target} (${written.length} bytes, ${chars.length} chars)`);
