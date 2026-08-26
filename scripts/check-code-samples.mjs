#!/usr/bin/env node
/**
 * Syntax-checks every code sample in every live track.
 *
 * Lesson code blocks are strings inside a .ts file, so nothing ever parsed
 * them — a typo would ship to learners and only be caught by one of them.
 * This extracts each block and runs it through the real parser for its
 * language.
 *
 * IMPORTANT: this proves a sample *parses*. It does not prove the sample is
 * correct, that an API signature is current, or that the surrounding
 * explanation is true. Those need a human who knows the subject.
 *
 * Usage: npm run check:samples
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// track id → [content file, language]
const TRACKS = {
  js: ["js-track", "js"],
  dsa: ["dsa-track", "js"],
  python: ["python-track", "py"],
  genai: ["genai-track", "py"],
  prompting: ["prompting-track", "py"],
  rag: ["rag-track", "py"],
  llmapps: ["llmapps-track", "py"],
};

/**
 * Blocks that are deliberately not the track's language — shell sessions,
 * config files, pseudocode. Listed explicitly rather than guessed at, so a
 * skip is always a decision someone made on purpose.
 */
const NOT_CODE = new Set([
  "python:16", // venv / pip — a shell session, in a Python track
]);

function unescape(block) {
  return block
    .replace(/<\/?KW>/g, "")
    .replace(/\\\\n/g, "\\n")
    .replace(/\\`/g, "`")
    .replace(/\\\$\{/g, "${");
}

const dir = mkdtempSync(join(tmpdir(), "samples-"));
let checked = 0;
const failures = [];
const skipped = [];

try {
  for (const [id, [file, lang]] of Object.entries(TRACKS)) {
    const source = readFileSync(`lib/tracks/${file}.ts`, "utf8");
    const blocks = [...source.matchAll(/code: `([\s\S]*?)`,\n/g)].map((m) => m[1]);

    blocks.forEach((raw, i) => {
      const key = `${id}:${i}`;
      if (NOT_CODE.has(key)) {
        skipped.push(key);
        return;
      }

      const path = join(dir, `${id}_${i}.${lang}`);
      writeFileSync(path, unescape(raw));
      checked += 1;

      try {
        if (lang === "js") {
          execFileSync("node", ["--check", path], { stdio: "pipe" });
        } else {
          execFileSync("python3", ["-c", `import ast,sys;ast.parse(open(sys.argv[1]).read())`, path], { stdio: "pipe" });
        }
      } catch (err) {
        const detail = (err.stderr?.toString() || err.message).trim().split("\n").slice(-3).join("\n");
        failures.push({ key, detail });
      }
    });
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log(`checked ${checked} code samples across ${Object.keys(TRACKS).length} tracks`);
if (skipped.length) {
  console.log(`skipped ${skipped.length} (declared not-code): ${skipped.join(", ")}`);
}

if (failures.length) {
  console.log(`\n${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ${f.key}\n    ${f.detail.replace(/\n/g, "\n    ")}\n`);
  process.exit(1);
}

console.log("all samples parse");
