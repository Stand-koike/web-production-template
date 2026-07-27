/**
 * 画像最適化スクリプト雛形（案件側で sharp 等を導入して拡張）
 *
 * ルール（テンプレ標準）:
 * - 表示幅の約2倍までリサイズ
 * - 透過不要なら JPEG（quality ~80–85）
 * - 同一ファイルの二重パスを統合
 *
 * 使い方（sharp 導入後の例）:
 *   npm install --save-dev sharp
 *   node scripts/optimize-images.mjs
 *
 * 現状: ルール確認と対象ファイル列挙のみ（依存追加なし）
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "assets");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
      continue;
    }
    if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(ASSETS_DIR);
  console.log(`Found ${files.length} image(s) under assets/`);

  for (const file of files) {
    const stat = await fs.stat(file);
    const kb = Math.round(stat.size / 1024);
    console.log(`- ${path.relative(ROOT, file)} (${kb} KB)`);
  }

  console.log("\nNext steps (case repo):");
  console.log("1. Install sharp (or similar)");
  console.log("2. Resize to ~2x display width, JPEG when alpha unused");
  console.log("3. Dedupe identical binaries referenced by multiple paths");
  console.log("4. npm run build && npm run preview");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
