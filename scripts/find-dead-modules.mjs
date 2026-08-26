#!/usr/bin/env node
/**
 * Finds files no route can reach.
 *
 * Walks the import graph outward from every entry point Next actually uses
 * (app/**\/page.tsx, route.ts, layout.tsx, proxy.ts) and reports whatever
 * it never arrives at. Substring greps get this wrong — "ai-track" matches
 * "genai-track" — so this resolves real import specifiers.
 *
 * Usage: node scripts/find-dead-modules.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";

const ROOT = process.cwd();
const EXT = [".ts", ".tsx", ".mjs", ".js"];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

function resolveSpec(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null; // package import

  for (const candidate of [base, ...EXT.map((e) => base + e), ...EXT.map((e) => join(base, "index" + e))]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const all = walk(ROOT);

const entries = all.filter((f) => {
  const r = relative(ROOT, f);
  return (
    /^app\/.*\/(page|layout|route|loading|error|not-found|sitemap|robots|icon)\.tsx?$/.test(r) ||
    /^app\/(page|layout|sitemap|robots|icon)\.tsx?$/.test(r) ||
    r === "proxy.ts" ||
    r.startsWith("scripts/") ||
    r === "middleware.ts"
  );
});

const reached = new Set();
const queue = [...entries];

while (queue.length) {
  const file = queue.pop();
  if (reached.has(file)) continue;
  reached.add(file);

  const src = readFileSync(file, "utf8");
  const specs = [
    ...src.matchAll(/(?:from|import)\s+["']([^"']+)["']/g),
    ...src.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g),
  ].map((m) => m[1]);

  for (const spec of specs) {
    const target = resolveSpec(spec, file);
    if (target && !reached.has(target)) queue.push(target);
  }
}

const dead = all
  .filter((f) => !reached.has(f))
  .map((f) => relative(ROOT, f))
  .filter((f) => !f.startsWith("scripts/"))
  .sort();

const lines = dead.map((f) => {
  const n = readFileSync(join(ROOT, f), "utf8").split("\n").length;
  return { f, n };
});

console.log(`${all.length} files, ${reached.size} reachable, ${dead.length} unreachable\n`);
for (const { f, n } of lines) console.log(`  ${String(n).padStart(5)}  ${f}`);
console.log(`\n  ${String(lines.reduce((a, b) => a + b.n, 0)).padStart(5)}  total lines`);
