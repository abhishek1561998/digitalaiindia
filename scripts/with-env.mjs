#!/usr/bin/env node
// Runs a command with .env.local loaded.
//
// Next.js loads .env.local automatically; the Prisma CLI does not — it only
// reads .env. Rather than duplicating DATABASE_URL into a second file (two
// places to rotate a credential), every Prisma script goes through here.
//
// Usage:
//   node scripts/with-env.mjs npx prisma db push
//   node scripts/with-env.mjs --env .env.production.local npx prisma db push
//
// The --env form is how you point a command at production without pasting a
// connection string into your shell history. Pull the file first with:
//   vercel env pull .env.production.local --environment=production

import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);

// An explicit --env file wins outright — mixing it with .env.local is how
// you end up running a production command against your laptop's database.
let FILES = [".env.local", ".env"];
if (argv[0] === "--env") {
  const file = argv[1];
  if (!file) {
    console.error("--env needs a file path");
    process.exit(1);
  }
  FILES = [file];
  argv.splice(0, 2);
}

// Consumed here, applied after the env file is loaded — see below.
const directDb = argv[0] === "--direct-db";
if (directDb) argv.splice(0, 1);

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
  if (!existsSync(path)) {
    if (FILES.length === 1) {
      console.error(`env file not found: ${file}`);
      process.exit(1);
    }
    continue;
  }
  for (const [key, value] of Object.entries(parse(readFileSync(path, "utf8")))) {
    if (env[key] === undefined || env[key] === "") env[key] = value;
  }
}

const [command, ...args] = argv;
if (!command) {
  console.error("usage: node scripts/with-env.mjs <command> [args...]");
  process.exit(1);
}

// Schema commands need a clean, direct connection.
//
// Two things go wrong with a Vercel-pulled Neon URL:
//
//   1. A value pasted into Vercel with a trailing newline comes back as a
//      literal "\\n" on the end of the string. Prisma rejects it as an
//      illegal character — and so does the deployed app, which is why this
//      is worth fixing at the source too.
//   2. The default URL points at Neon's "-pooler" host with pgbouncer=true.
//      That's PgBouncer in transaction mode, which can't run DDL reliably.
//      Schema changes belong on the direct endpoint.
//
// This only rewrites the copy handed to the child process; nothing is
// written back to the env file.
if (directDb && env.DATABASE_URL) {
  try {
    const cleaned = env.DATABASE_URL.replace(/\\[nrt]/g, "").trim();
    const url = new URL(cleaned);
    url.hostname = url.hostname.replace("-pooler.", ".");
    url.searchParams.delete("pgbouncer");
    url.searchParams.delete("connection_limit");
    env.DATABASE_URL = url.toString();
    console.error("[with-env] using direct connection for schema work");
  } catch {
    console.error("[with-env] DATABASE_URL is not a valid URL — leaving it as-is");
  }
}

if (env.DATABASE_URL) {
  const host = env.DATABASE_URL.replace(/^[a-z]+:\/\/[^@]*@/, "").split(/[/?]/)[0];
  console.error(`[with-env] DATABASE_URL host: ${host}`);
}

const child = spawn(command, args, { stdio: "inherit", env, shell: process.platform === "win32" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
