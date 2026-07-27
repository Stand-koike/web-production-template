/**
 * Optional: viewport はみ出し監査サンプル（必須 CI にはしない）
 *
 * Playwright 等で各ページを開き、375px 幅で要素の getBoundingClientRect()
 * が viewport 外にはみ出していないか列挙する。
 *
 * 使い方（案件リポで Playwright 導入済みの場合）:
 *
 *   import { chromium } from "playwright";
 *
 *   const WIDTH = 375;
 *   const browser = await chromium.launch();
 *   const page = await browser.newPage({ viewport: { width: WIDTH, height: 812 } });
 *   await page.goto("http://localhost:8080/dist/index.html");
 *
 *   const offenders = await page.evaluate((vw) => {
 *     return [...document.querySelectorAll("body *")]
 *       .filter((el) => {
 *         const r = el.getBoundingClientRect();
 *         return r.right > vw + 1 || r.left < -1;
 *       })
 *       .slice(0, 20)
 *       .map((el) => ({
 *         tag: el.tagName,
 *         class: el.className,
 *         rect: el.getBoundingClientRect(),
 *       }));
 *   }, WIDTH);
 *
 *   console.log(offenders);
 *   await browser.close();
 *
 * Reviewer 手動でも可: DevTools → 375px → 横スクロール・要素 inspect
 * 詳細: docs/reviewer-checklist.md
 */

console.log("See file header for Playwright sample. Not run automatically.");
