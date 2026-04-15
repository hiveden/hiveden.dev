#!/usr/bin/env node

/**
 * 中文 Markdown 标点修复脚本
 *
 * 用法: node scripts/fix-cn-punctuation.mjs <file.md> [--dry-run]
 *
 * 修复项:
 *   1. ASCII 直引号 "..." → 中文弯引号 "..."
 *   2. 中文语境下的半角 , : ? ! ; → 全角 ，：？！；
 *
 * 自动跳过 fenced code blocks (``` / ~~~) 和 inline code (`...`)
 */

import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!file) {
  console.error(
    "用法: node scripts/fix-cn-punctuation.mjs <file.md> [--dry-run]"
  );
  process.exit(1);
}

const CJK =
  "\\u4e00-\\u9fff\\u3400-\\u4dbf\\uf900-\\ufaff" + // CJK Unified
  "\\u3000-\\u303f" + // CJK Symbols
  "\\uff00-\\uffef" + // Fullwidth Forms
  "\\u2600-\\u27bf"; // Misc symbols

const CJK_RE = new RegExp(`[${CJK}]`);

let text = readFileSync(file, "utf8");
let changes = 0;

// --- Split text into code / non-code segments ---
// Fenced blocks (``` or ~~~) and inline code (`...`) are preserved as-is.
const CODE_BLOCK = /(^`{3,}.*$[\s\S]*?^`{3,}$|^~{3,}.*$[\s\S]*?^~{3,}$)/gm;
const INLINE_CODE = /(`[^`]+`)/g;

function splitProtected(input) {
  const parts = [];
  let last = 0;

  // First: fenced code blocks
  const segments = [];
  let m;
  CODE_BLOCK.lastIndex = 0;
  while ((m = CODE_BLOCK.exec(input)) !== null) {
    if (m.index > last) segments.push({ text: input.slice(last, m.index), code: false });
    segments.push({ text: m[0], code: true });
    last = m.index + m[0].length;
  }
  if (last < input.length) segments.push({ text: input.slice(last), code: false });

  // Second: inline code within non-code segments
  for (const seg of segments) {
    if (seg.code) {
      parts.push(seg);
      continue;
    }
    let inner = seg.text;
    let innerLast = 0;
    INLINE_CODE.lastIndex = 0;
    while ((m = INLINE_CODE.exec(inner)) !== null) {
      if (m.index > innerLast) parts.push({ text: inner.slice(innerLast, m.index), code: false });
      parts.push({ text: m[0], code: true });
      innerLast = m.index + m[0].length;
    }
    if (innerLast < inner.length) parts.push({ text: inner.slice(innerLast), code: false });
  }

  return parts;
}

const parts = splitProtected(text);

// --- Apply fixes only to non-code parts ---
const punctMap = { ",": "，", ":": "：", "?": "？", "!": "！", ";": "；" };

for (const part of parts) {
  if (part.code) continue;

  let t = part.text;

  // 1. ASCII straight quotes → Chinese curly quotes
  t = t.replace(/"([^"]*?)"/g, (match, inner) => {
    if (!CJK_RE.test(inner)) return match;
    changes++;
    return `\u201c${inner}\u201d`;
  });

  // 2. Half-width punctuation in CJK context → full-width
  for (const [half, full] of Object.entries(punctMap)) {
    const escaped = half.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `([${CJK}\\*\\)）】」\u201d])${escaped}|${escaped}(?=[${CJK}\\*\\(（【「\u201c])`,
      "g"
    );
    t = t.replace(re, (match) => {
      changes++;
      return match.replace(half, full);
    });
  }

  part.text = t;
}

const result = parts.map((p) => p.text).join("");

if (changes === 0) {
  console.log("无需修改");
  process.exit(0);
}

if (dryRun) {
  console.log(`[dry-run] 将修改 ${changes} 处`);
  process.stdout.write(result);
} else {
  writeFileSync(file, result, "utf8");
  console.log(`已修复 ${changes} 处`);
}
