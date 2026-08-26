#!/usr/bin/env node
// Runs a command with .env.local loaded.
//
// Next.js loads .env.local automatically; the Prisma CLI does not — it only
// reads .env. Rather than duplicating DATABASE_URL into a second file (two
// places to rotate a credential), every Prisma script goes through here.
//
// Usage: node scripts/with-env.mjs prisma migrate dev --name whatever

import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FILES = [".env.local", ".env"];

function parse(contents) {
  const out = {};
  for (const raw of contents.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip one layer of matching quotes, the way dotenv does.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = { ...process.env };
// Earlier files win, matching Next's precedence (.env.local over .env).
for (const file of FILES) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  for (const [key, value] of Object.entries(parse(readFileSync(path, "utf8")))) {
    if (env[key] === undefined || env[key] === "") env[key] = value;
  }
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("usage: node scripts/with-env.mjs <command> [args...]");
  process.exit(1);
}

const child = spawn(command, args, { stdio: "inherit", env, shell: process.platform === "win32" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
