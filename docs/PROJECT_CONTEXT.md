# web-production-template 開発引継ぎ資料

## Repository

対象: `web-production-template`

目的: AI Agent と協働する Web 制作基盤の構築

---

## 現状サマリー（2026-09-01）

**骨格〜典型サイト一式は完成。** 案件横展開の準備段階。ならいの風案件から得たレスポンシブ知見を統合済み。

| 領域 | 状態 |
|------|------|
| Build（multi-page / linkedom / `.nojekyll` / assets wipe） | ✅ |
| ページシェル横幅規約 | ✅ |
| レスポンシブ（768–1439px 流体化 / Hero clamp / overlay header 任意 kit） | ✅ |
| Reviewer（375/768/1024/1280/1366/1920 + 短い画面高） | ✅ |
| Deploy（dist のみ・gh-pages workflow・Pages 404 防止） | ✅ |
| Performance（画像ルール・optimize 雛形） | ✅ |
| Animation（dev/prod 二重起動） | ✅ |
| コンポーネント `{{VAR}}` / SEO 骨組み | ✅ |
| linkedom Hero 動画 guard（`__SITE_BUILD__`） | ✅ |
| 案件固有作業 | ❌（案件リポ側） |

---

## Agent 工程と責務

```
Builder → Animation → Reviewer → Performance → Deploy
```

| 工程 | 主担当 |
|------|--------|
| Builder | シェル・リンク・1366/1920・流体化・`responsive-fluid.css`・SEO 骨組み |
| Reviewer | **375/768/1024/1280/1366/1920**・短い画面高・dist・a11y |
| Performance | 画像リサイズ・lazy/async |
| Deploy | **`dist/` のみ**（main root 禁止） |

Agent プロンプト: `.cursor/prompts/{builder,animation,reviewer,performance,deploy}.md`

---

## 次のタasks

1. 案件横展開 — `case-adoption.md` + `reviewer-checklist.md` + `deployment.md`
2. 実案件での Builder → Reviewer → Performance → Deploy フロー検証
3. 追加 Pattern（案件要求が出てから）

Agent プロンプト一式: `.cursor/prompts/{builder,animation,reviewer,performance,deploy}.md` ✅

---

## 関連ドキュメント

- **`docs/USAGE.md`** — テンプレートの使い方（案件フロー・Agent 依頼）
- `docs/responsive-patterns.md` — 768–1439px / Hero clamp / linkedom guard
- `docs/reviewer-checklist.md`
- `docs/page-shell.md`
- `docs/deployment.md`
- `docs/performance.md`
- `docs/builder-workflow.md`
- `docs/animation-system.md`
- `docs/case-adoption.md`
