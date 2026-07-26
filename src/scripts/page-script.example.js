/**
 * ページ固有スクリプトの雛形（コピーして {name}.js にリネーム）
 *
 * 配線（3点セット — どれか欠けると dist で欠落）:
 * 1. このファイルを src/scripts/{name}.js として追加
 * 2. 対象 src/pages/*.html（または index）に <script> を追加
 * 3. site.manifest.json の output.scripts に "scripts/{name}.js" を追加
 *
 * パス置換: 下層の ../scripts/ は build-production.mjs が scripts/ に置換する
 * （個別置換の追加は不要。manifest への登録と HTML の script タグが必須）
 *
 * 起動は animation.js と同じ二重起動:
 * - 開発（load-sections あり）: page:ready
 * - 本番 dist: DOMContentLoaded / 即時
 */

let pageScriptInitialized = false;

function hasDevLoaders() {
  return Boolean(document.querySelector('script[src*="load-sections.js"]'));
}

function initPageScript() {
  if (pageScriptInitialized) return;
  pageScriptInitialized = true;

  // body[data-page] で対象外なら return
  // const page = document.body?.dataset?.page;
  // if (page !== "faq") return;

  // --- ここにページ固有ロジック ---
  // アコーディオン等で高さが変わる場合:
  // 1. 初期は CSS で閉じた状態にしておく
  // 2. 開閉のたびに ScrollTrigger.refresh()
  //    （animation.js の refreshScrollTriggers を import するか、
  //     window 経由 / 動的 import で呼ぶ）
}

function boot() {
  try {
    initPageScript();
  } catch (error) {
    console.warn("[page-script] init skipped:", error);
  }
}

function scheduleBoot() {
  if (hasDevLoaders()) {
    document.addEventListener("page:ready", boot, { once: true });
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

scheduleBoot();
