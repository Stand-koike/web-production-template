# Animation Spec

人が数値・ON/OFF を編集し、Agent が `src/scripts/animation.js` の `MOTION` に反映する。

## MOTION

| キー | 値 | 説明 |
|------|-----|------|
| duration | 0.9 | 通常の fade-up 秒数 |
| durationSlow | 1.2 | Hero 秒数 |
| y | 24 | 上昇 px |
| stagger | 0.12 | グリッド stagger 秒 |
| staggerHero | 0.15 | Hero 子 stagger 秒 |
| ease | power2.out | GSAP ease |
| start | top 85% | ScrollTrigger start |
| once | true | 一度だけ再生 |
| labelScale | 0.98 | label 初期 scale |

## ON / OFF

| 機能 | ON/OFF | 備考 |
|------|--------|------|
| Hero stagger | ON | `data-animate="hero"` |
| main reveal | ON | `main > *` |
| stagger-grid | ON | `data-animate="stagger-grid"` |
| label | ON | 要素があるときのみ |
| reduced-motion スキップ | ON | 必須維持 |
| ScrollTrigger markers | OFF | 本番禁止 |

## 適用ページ

| ページ | 対象 |
|--------|------|
| index.html | TOP 全セクション |
| pages/* | 下層（GSAP + animation.js 必須） |

## Agent への指示例

```text
docs/animation-spec.md の MOTION 値に合わせて
src/scripts/animation.js の MOTION 定数を更新してください。
HTML 構造は変更しないでください。
```
