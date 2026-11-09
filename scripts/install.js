#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const SKILL = "ux-psychic";
const TARGETS = [".claude/skills", ".agents/skills", ".opencode/skills"];

const pkgRoot = path.resolve(__dirname, "..");
const projectRoot = process.env.INIT_CWD || process.cwd();
const isPostinstall = process.env.npm_lifecycle_event === "postinstall";

function walkFiles(dir, prefix = "") {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      entries.push(...walkFiles(path.join(dir, entry.name), rel));
    } else {
      entries.push(rel);
    }
  }
  return entries;
}

function copyFiltered(src, dest, skip) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFiltered(s, d, new Set());
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function install(targetRoot, dry) {
  const dest = path.join(targetRoot, SKILL);
  const skip = new Set(["package.json", "package-lock.json", "README.md", "scripts", ".claude", ".agents", ".opencode", "node_modules", ".gitignore", ".npmignore", ".git"]);
  if (dry) {
    const files = walkFiles(pkgRoot).filter((f) => !skip.has(f.split(path.sep)[0]));
    console.log(`  ${dest}/`);
    if (files.length === 0) console.log("    (no files to install)");
    for (const f of files) console.log(`    ${f}`);
    return;
  }
  copyFiltered(pkgRoot, dest, skip);
  console.log(`  -> ${dest}`);
}

function uninstall(targetRoot, dry) {
  const dest = path.join(targetRoot, SKILL);
  if (!fs.existsSync(dest)) return;
  if (dry) { console.log(`  rm -rf ${dest}`); return; }
  fs.rmSync(dest, { recursive: true, force: true });
  console.log(`  rm -rf ${dest}`);
}

function findRoots() {
  const roots = [projectRoot];
  let d = projectRoot;
  const home = os.homedir();
  while (d !== path.dirname(d) && d !== home) {
    d = path.dirname(d);
    if (fs.existsSync(path.join(d, "package.json"))) roots.push(d);
  }
  return [...new Set(roots)];
}

// ── postinstall auto-mode ──────────────────────────────────────────
if (isPostinstall) {
  for (const target of TARGETS) install(path.join(projectRoot, target), false);
  process.exit(0);
}

// ── CLI ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const cmd = args[0];
const dry = args.includes("--dry") || args.includes("-n");
const globalFlag = args.includes("-g") || args.includes("--global");

const userTargets = [path.join(os.homedir(), ".opencode/skills"), path.join(os.homedir(), ".claude/skills"), path.join(os.homedir(), ".agents/skills")];

if (cmd === "uninstall") {
  const targets = globalFlag ? userTargets : findRoots().flatMap((r) => TARGETS.map((t) => path.join(r, t)));
  console.log(dry ? "Dry run — would remove:\n" : "Removing UX-PSYCHIC...\n");
  for (const base of targets) uninstall(base, dry);
  console.log("");
} else if (cmd === "status") {
  console.log("UX-PSYCHIC\n");
  const allProjects = [projectRoot];
  for (const root of findRoots()) { allProjects.push(root); }
  const projectTargets = [...new Set(allProjects.flatMap((r) => TARGETS.map((t) => path.join(r, t))))];
  console.log("  Project:");
  for (const base of projectTargets) {
    const p = path.join(base, SKILL, "SKILL.md");
    const state = fs.existsSync(p) ? "installed" : "missing  ";
    console.log(`    ${state}  ${base}/${SKILL}`);
  }
  console.log("\n  Global:");
  for (const base of userTargets) {
    const p = path.join(base, SKILL, "SKILL.md");
    const state = fs.existsSync(p) ? "installed" : "missing  ";
    console.log(`    ${state}  ${base}/${SKILL}`);
  }
  console.log("");
} else {
  const targets = globalFlag ? userTargets : findRoots().flatMap((r) => TARGETS.map((t) => path.join(r, t)));
  console.log(dry ? "Dry run — would install:\n" : "Installing UX-PSYCHIC...\n");
  for (const base of targets) install(base, dry);
  console.log("");
  if (!cmd) {
    console.log("Usage:");
    console.log("  npx ux-psychic            install to project");
    console.log("  npx ux-psychic -g         install globally (user-level)");
    console.log("  npx ux-psychic uninstall  remove from project");
    console.log("  npx ux-psychic status     check installation");
    console.log("  npx ux-psychic --dry      preview file changes\n");
  }
}
