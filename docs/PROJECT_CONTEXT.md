# web-production-template 開発引継ぎ資料

## Repository

対象: `web-production-template`

目的: AI Agent と協働する Web 制作基盤の構築

---

## 現状サマリー（2026-07-28）

**骨格〜典型サイト一式は完成。** 案件横展開の準備段階。

| 領域 | 状態 |
|------|------|
| Build（multi-page / linkedom / `.nojekyll` / assets wipe） | ✅ |
| ページシェル横幅規約 | ✅ |
| Reviewer（375/768/1366/1920 必須） | ✅ |
| Deploy（dist のみ・gh-pages workflow・Pages 404 防止） | ✅ |
| Performance（画像ルール・optimize 雛形） | ✅ |
| Animation（dev/prod 二重起動） | ✅ |
| コンポーネント `{{VAR}}` / SEO 骨組み | ✅ |
| 案件固有作業 | ❌（案件リポ側） |

---

## Agent 工程と責務

```
Builder → Animation → Reviewer → Performance → Deploy
```

| 工程 | 主担当 |
|------|--------|
| Builder | シェル・リンク・1366/1920・流体化・SEO 骨組み |
| Reviewer | **375/768/1366/1920**・dist・a11y |
| Performance | 画像リサイズ・lazy/async |
| Deploy | **`dist/` のみ**（main root 禁止） |

---

## 次のタasks

1. 案件横展開 — `case-adoption.md` + `reviewer-checklist.md` + `deployment.md`
2. Builder → Reviewer → Deploy フロー検証
3. Deploy / Performance プロンプト強化（必要時）

---

## 関連ドキュメント

- `docs/reviewer-checklist.md`
- `docs/page-shell.md`
- `docs/deployment.md`
- `docs/performance.md`
- `docs/builder-workflow.md`
- `docs/animation-system.md`
- `docs/case-adoption.md`
