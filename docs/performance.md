# Performance

画像・配信の最低ルール。案件固有の形式選択やコピーは含めない。

Performance 工程は **Reviewer 後・Deploy 前**。

---

## 画像リサイズ

- 表示幅の **約 2 倍**までにリサイズ（Retina 想定）
- 透過不要なら **JPEG**（品質 80–85 目安）
- 同一バイナリの二重パスを統合（1 URL に寄せる）

スクリプト雛形: [scripts/optimize-images.mjs](../scripts/optimize-images.mjs)  
（`sharp` 等は案件側で導入。テンプレはルールと雛形のみ）

---

## HTML / 配信

| 項目 | ルール |
|------|--------|
| below-fold 画像 | `loading="lazy"` + `decoding="async"` |
| above-fold Hero 等 | `loading="lazy"` を付けない（LCP 優先） |
| コンポーネント | `src/components/image.html` を参照 |

---

## CSS / JS

- 未使用 CSS の削減（案件規模に応じて）
- ページで使わない GSAP プラグインは読み込まない（[animation-system.md](./animation-system.md)）
- 本番は minify / bundling は任意（静的 HTML テンプレでは未必須）

---

## ビルド成果物

- `dist/assets` は毎ビルド wipe → コピー（削除済み巨大ファイルが残らない）
- Deploy 前に `npm run preview` で確認

---

## 関連

- [deployment.md](./deployment.md)
- [reviewer-checklist.md](./reviewer-checklist.md)
