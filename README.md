# web-production-template
# Stand Studio Development System

## Purpose

このリポジトリは、Web制作をAIエージェントと協働して高速・高品質に行うための制作基盤です。

対象:

* 宿泊施設サイト
* コーポレートサイト
* 地域観光サイト

## Production Flow

Pencil.dev
↓
Builder
↓
Animation
↓
Reviewer
↓
Performance
↓
Deploy

## Core Principle

AIは自由に作るのではなく、役割ごとに責任範囲を分離する。

各Agentは担当領域以外を変更しない。

## Current Agents

### Builder

役割:
Pencil.dev出力コードの整理

担当:

* HTML整理
* Semantic HTML化
* Tailwind整理
* Component候補抽出

禁止:

* デザイン変更
* アニメーション追加
* 画像変更

### Animation

役割:
サイト体験向上

担当:

* GSAP
* ScrollTrigger
* 動きの統一

### Reviewer

役割:
品質確認

担当:

* UI
* UX
* SEO
* Accessibility

### Performance

役割:
速度改善

担当:

* 画像
* CSS
* JavaScript
* Core Web Vitals
