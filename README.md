# web-production-template

Stand Studio Development System — AI Agent と協働する Web 制作基盤

## Purpose

宿泊施設・コーポレート・地域観光サイトを、役割分離した AI Agent ワークフローで高速・高品質に制作するためのテンプレートです。

**個別案件の完成ではなく、横展開可能な制作システム** を構築・改善するリポジトリです。

## Production Flow

```
Pencil.dev
    ↓ HTML Export
Builder Agent          ← 構造化・データ切り出し・ビルド基盤
    ↓
Animation Agent        ← GSAP
    ↓
Reviewer
    ↓
Performance
    ↓
Deploy（dist/）
```

**Builder 工程の詳細:** [docs/builder-workflow.md](docs/builder-workflow.md)

## Technology

- HTML（ページシェル + セクション）
- CSS（Design Tokens / Theme）
- JavaScript（section / component ランタイム注入）
- GSAP + ScrollTrigger
- linkedom（本番ビルド）

## Project Structure

```
assets/images/              画像アセット（プロジェクトルート）
dist/                       本番ビルド出力
src/
  index.html                TOP ページシェル
  pages/                    下層ページシェル
  sections/                 セクション断片
  components/               button / nav-link 等
  data/                     facility.json / content.json
  scripts/                  load-data.js / load-sections.js / animation.js
  styles/                   tokens.css / theme.css / main.css
  templates/web-production/ ビルド設定
scripts/
  build-production.mjs      本番 HTML 生成
docs/
  builder-workflow.md       Builder 工程ドキュメント
  PROJECT_CONTEXT.md        開発引継ぎ資料
```

## Local Development

`load-sections.js` による section / component の fetch 読み込みを行うため、**ローカル HTTP サーバー経由での確認が必須**です。

### 起動手順

1. **プロジェクトルート**で HTTP サーバーを起動

   ```bash
   py -m http.server 8080
   ```

2. ブラウザで開発用 URL を開く

   | ページ | URL |
   |--------|-----|
   | TOP | http://localhost:8080/src/index.html |
   | About（例） | http://localhost:8080/src/pages/about.html |

### 注意事項

- **`file://` での直開きは不可** — fetch が CORS 制約により失敗します
- **サーバーはプロジェクトルートから起動** — `src/` 内から起動すると `../assets/` 参照の画像が 404 になります
- 下層ページは `window.__SRC_BASE__` / `window.__ASSET_BASE__` によりパスを解決します

## Production Build

```bash
npm install
npm run build
```

| 入力 | 出力 |
|------|------|
| `src/index.html` | `dist/index.html` |
| `src/pages/*.html` | `dist/{同名}.html` |

### 本番出力の特徴

- section / data / pattern / component を **ビルド時に展開済み**
- `load-data.js` / `load-sections.js` は **含めない**
- 画像パスは `assets/` に統一
- `facility.json` の `theme` から `dist/styles/theme.css` を生成

## Core Principle

AI は自由に作るのではなく、役割ごとに責任範囲を分離する。各 Agent は担当領域以外を変更しない。

## Documentation

| ドキュメント | 内容 |
|-------------|------|
| [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) | 開発引継ぎ・タスクロードマップ |
| [docs/builder-workflow.md](docs/builder-workflow.md) | Builder 工程の標準手順 |
| [docs/build-system.md](docs/build-system.md) | ビルドシステム概要 |
| [docs/architecture.md](docs/architecture.md) | アーキテクチャ |
| [docs/deployment.md](docs/deployment.md) | デプロイ手順 |
| [docs/case-adoption.md](docs/case-adoption.md) | 案件リポジトリへの横展開 |
